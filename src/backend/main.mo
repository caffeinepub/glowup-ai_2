import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Gender = {
    #male;
    #female;
    #nonBinary;
    #other : Text;
  };

  type UserProfile = {
    username : Text;
    age : Nat;
    gender : Gender;
    goals : [Text];
    bio : Text;
    createdAt : Time.Time;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Nat.compare(profile1.age, profile2.age);
    };
  };

  type PhotoAnalysis = {
    photoId : Text;
    skinScore : Nat;
    hairScore : Nat;
    symmetryScore : Nat;
    styleScore : Nat;
    overallScore : Nat;
    timestamp : Time.Time;
  };

  type Message = {
    question : Text;
    answer : Text;
    timestamp : Time.Time;
  };

  type UserData = {
    analyses : List.List<PhotoAnalysis>;
    messages : List.List<Message>;
  };

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Blob storage
  include MixinStorage();

  // Persistent store
  let profiles = Map.empty<Principal, UserProfile>();
  let users = Map.empty<Principal, UserData>();
  let blobReferences = Map.empty<Text, Storage.ExternalBlob>();
  let blobOwners = Map.empty<Text, Principal>();

  // User profile management
  public shared ({ caller }) func createOrUpdateProfile(username : Text, age : Nat, gender : Gender, goals : [Text], bio : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    let newProfile : UserProfile = {
      username;
      age;
      gender;
      goals;
      bio;
      createdAt = Time.now();
    };
    profiles.add(caller, newProfile);
    if (not users.containsKey(caller)) {
      users.add(
        caller,
        {
          analyses = List.empty<PhotoAnalysis>();
          messages = List.empty<Message>();
        },
      );
    };
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getCallerProfile() : async UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their own profiles");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  // Alias for frontend compatibility
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their profiles");
    };
    profiles.get(caller);
  };

  // Alias for frontend compatibility
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // Alias for frontend compatibility
  public shared ({ caller }) func saveCallerUserProfile(username : Text, age : Nat, gender : Gender, goals : [Text], bio : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let newProfile : UserProfile = {
      username;
      age;
      gender;
      goals;
      bio;
      createdAt = Time.now();
    };
    profiles.add(caller, newProfile);
    if (not users.containsKey(caller)) {
      users.add(
        caller,
        {
          analyses = List.empty<PhotoAnalysis>();
          messages = List.empty<Message>();
        },
      );
    };
  };

  // Photo analysis
  public shared ({ caller }) func addPhotoAnalysis(photoId : Text, skinScore : Nat, hairScore : Nat, symmetryScore : Nat, styleScore : Nat, overallScore : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add analysis");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userData) {
        let newAnalysis : PhotoAnalysis = {
          photoId;
          skinScore;
          hairScore;
          symmetryScore;
          styleScore;
          overallScore;
          timestamp = Time.now();
        };
        userData.analyses.add(newAnalysis);
      };
    };
  };

  public query ({ caller }) func getUserAnalyses(user : Principal) : async [PhotoAnalysis] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own analyses");
    };
    switch (users.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?userData) { userData.analyses.toArray() };
    };
  };

  // Messaging
  public shared ({ caller }) func addMessage(question : Text, answer : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userData) {
        let newMessage : Message = {
          question;
          answer;
          timestamp = Time.now();
        };
        userData.messages.add(newMessage);
      };
    };
  };

  public query ({ caller }) func getUserMessages(user : Principal) : async [Message] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own messages");
    };
    switch (users.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?userData) { userData.messages.toArray() };
    };
  };

  // Blob management
  public shared ({ caller }) func addPhotoReference(id : Text, blob : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add photo references");
    };
    blobReferences.add(id, blob);
    blobOwners.add(id, caller);
  };

  public query ({ caller }) func getPhotoReference(id : Text) : async Storage.ExternalBlob {
    switch (blobOwners.get(id)) {
      case (null) { Runtime.trap("Blob not found") };
      case (?owner) {
        if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only access your own photos");
        };
        switch (blobReferences.get(id)) {
          case (null) { Runtime.trap("Blob not found") };
          case (?blob) { blob };
        };
      };
    };
  };

  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    profiles.values().toArray().sort();
  };
};

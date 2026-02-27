import 'dart:io';

enum UserRole { tenant, landlord, unknown }

class User {
  final String id;
  final String email;

  final String? firstName;
  final String? lastName;
  final String? middleName;

  final String? phoneNumber;
  final String? profilePicture;

  final String? maritalStatus;
  final String? apartmentOrSuite;
  final String? street;
  final String? city;
  final String? state;
  final String? country;

  final String? occupation;
  final String? employmentStatus;

  final String? identityCard;
  final String? nationalIdCard;

  final DateTime? dateOfBirth;
  final DateTime? joinedAt;

  final bool isOnboarded;
  final bool isEmailVerified;
  final bool isVerified;
  final bool isPendingVerification;
  final bool isActive;
  final bool isDeleted;

  final UserRole role;

  User({
    required this.id,
    required this.email,
    required this.role,

    this.firstName,
    this.lastName,
    this.middleName,

    this.phoneNumber,
    this.profilePicture,

    this.maritalStatus,
    this.apartmentOrSuite,
    this.street,
    this.city,
    this.state,
    this.country,

    this.occupation,
    this.employmentStatus,

    this.identityCard,
    this.nationalIdCard,

    this.dateOfBirth,
    this.joinedAt,

    this.isOnboarded = false,
    this.isEmailVerified = false,
    this.isVerified = false,
    this.isPendingVerification = false,
    this.isActive = true,
    this.isDeleted = false,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    final data = json['data'];

    // Handle both camelCase and snake_case field names
    final firstName = data['firstName'] ?? data['first_name'];
    final lastName = data['lastName'] ?? data['last_name'];
    final middleName = data['middleName'] ?? data['middle_name'];
    final phoneNumber =
        data['phone_number'] ?? data['phoneNumber'] ?? data['phone'];
    final profilePicture = data['profile_picture'] ?? data['profilePicture'];

    return User(
      id: data['id'] ?? '',
      email: data['email'] ?? '',
      role: _parseRole(data['role']),

      firstName: firstName,
      lastName: lastName,
      middleName: middleName,

      phoneNumber: phoneNumber,
      profilePicture: profilePicture,

      maritalStatus: data['marital_status'] ?? data['maritalStatus'],
      apartmentOrSuite: data['apartment_or_suite'] ?? data['apartmentOrSuite'],
      street: data['street'],
      city: data['city'],
      state: data['state'],
      country: data['country'],

      occupation: data['occupation'],
      employmentStatus: data['employment_status'] ?? data['employmentStatus'],

      identityCard: data['identity_card'] ?? data['identityCard'],
      nationalIdCard: data['national_id_card'] ?? data['nationalIdCard'],

      dateOfBirth: data['date_of_birth'] == null
          ? null
          : HttpDate.parse(data['date_of_birth']),

      joinedAt: data['joined_at'] == null
          ? null
          : HttpDate.parse(data['joined_at']),

      isOnboarded: data['is_onboarded'] ?? false,
      isEmailVerified: data['is_email_verified'] ?? false,
      isVerified: data['is_verified'] ?? false,
      isPendingVerification: data['isPendingVerification'] ?? false,
      isActive: data['is_active'] == 'true' || data['is_active'] == true,
      isDeleted: data['is_deleted'] == 'true' || data['is_deleted'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'role': role.name,

      'firstName': firstName,
      'lastName': lastName,
      'middleName': middleName,

      'phone_number': phoneNumber,
      'profile_picture': profilePicture,

      'marital_status': maritalStatus,
      'apartment_or_suite': apartmentOrSuite,
      'street': street,
      'city': city,
      'state': state,
      'country': country,

      'occupation': occupation,
      'employment_status': employmentStatus,

      'identity_card': identityCard,
      'national_id_card': nationalIdCard,

      'date_of_birth': dateOfBirth?.toIso8601String(),
      'joined_at': joinedAt?.toIso8601String(),

      'is_onboarded': isOnboarded,
      'is_email_verified': isEmailVerified,
      'is_verified': isVerified,
      'isPendingVerification': isPendingVerification,
      'is_active': isActive,
      'is_deleted': isDeleted,
    };
  }

  static UserRole _parseRole(String? role) {
    switch (role?.toLowerCase()) {
      case 'tenant':
        return UserRole.tenant;
      case 'landlord':
        return UserRole.landlord;
      default:
        return UserRole.unknown;
    }
  }
}

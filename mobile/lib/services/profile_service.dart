import 'http_client.dart';
import 'api_config.dart';
import '../models/user_model.dart';

class ProfileService {
  final HttpClient httpClient;

  ProfileService(this.httpClient);

  Future<User> getProfile() async {
    try {
      return await httpClient.get<User>(
        ApiConfig.profileEndpoint,
        fromJson: (json) => User.fromJson(json),
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<User> updateProfile({
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    try {
      final data = {
        if (firstName != null) 'firstName': firstName,
        if (lastName != null) 'lastName': lastName,
        if (phone != null) 'phone': phone,
      };

      return await httpClient.put<User>(
        ApiConfig.profileEndpoint,
        data: data,
        fromJson: (json) => User.fromJson(json),
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    try {
      if (newPassword != confirmPassword) {
        throw Exception('New passwords do not match');
      }

      await httpClient.put(
        ApiConfig.changePasswordEndpoint,
        data: {'currentPassword': currentPassword, 'newPassword': newPassword},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> uploadProfilePicture(String imagePath) async {
    try {
      await httpClient.uploadFile(
        ApiConfig.uploadProfilePictureEndpoint,
        filePath: imagePath,
        fieldName: 'profilePicture',
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> uploadIdentityDocuments(List<String> documentPaths) async {
    try {
      // Upload each document
      for (final docPath in documentPaths) {
        await httpClient.uploadFile(
          ApiConfig.uploadIdentityDocsEndpoint,
          filePath: docPath,
          fieldName: 'identityDocs',
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<void> requestVerification() async {
    try {
      await httpClient.post(
        '${ApiConfig.profileEndpoint}/request-verification',
        data: {},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> pauseAccount() async {
    try {
      await httpClient.post(ApiConfig.pauseAccountEndpoint, data: {});
    } catch (e) {
      rethrow;
    }
  }

  Future<void> resumeAccount() async {
    try {
      await httpClient.post(ApiConfig.resumeAccountEndpoint, data: {});
    } catch (e) {
      rethrow;
    }
  }

  Future<void> deleteAccount() async {
    try {
      await httpClient.delete(ApiConfig.deleteAccountEndpoint);
    } catch (e) {
      rethrow;
    }
  }
}

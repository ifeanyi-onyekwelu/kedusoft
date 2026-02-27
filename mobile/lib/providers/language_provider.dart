import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  static const String _languageKey = 'language_code';
  static const String defaultLanguage = 'en';

  String _languageCode = defaultLanguage;
  late SharedPreferences _prefs;
  bool _isInitialized = false;

  final List<Map<String, String>> supportedLanguages = [
    {'code': 'en', 'name': 'English', 'nativeName': 'English'},
    {'code': 'fr', 'name': 'French', 'nativeName': 'Français'},
    {'code': 'es', 'name': 'Spanish', 'nativeName': 'Español'},
    {'code': 'de', 'name': 'German', 'nativeName': 'Deutsch'},
  ];

  String get languageCode => _languageCode;
  Locale get locale => Locale(_languageCode);
  bool get isInitialized => _isInitialized;

  String getLanguageName(String? code) {
    if (code == null) return '';
    final lang = supportedLanguages.firstWhere(
      (l) => l['code'] == code,
      orElse: () => supportedLanguages[0],
    );
    return '${lang['name']} (${lang['nativeName']})';
  }

  Future<void> initialize() async {
    if (_isInitialized) return;

    _prefs = await SharedPreferences.getInstance();
    _languageCode = _prefs.getString(_languageKey) ?? defaultLanguage;
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> setLanguage(String languageCode) async {
    if (_languageCode == languageCode) return;

    // Validate language code
    if (!supportedLanguages.any((l) => l['code'] == languageCode)) {
      return;
    }

    _languageCode = languageCode;
    await _prefs.setString(_languageKey, _languageCode);
    notifyListeners();
  }

  void reset() {
    _languageCode = defaultLanguage;
  }
}

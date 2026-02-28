import 'package:intl/intl.dart';

class FormattingUtils {
  /// Format price with comma separation and currency symbol
  /// Example: 4000000 -> ₦4,000,000
  static String formatPrice(double price) {
    // Simple approach: convert to string and add commas manually
    final intPrice = price.toInt();
    final priceStr = intPrice.toString();

    // Add comma separators from right to left
    String result = '';
    for (int i = 0; i < priceStr.length; i++) {
      int charPos = priceStr.length - i - 1;
      if (i > 0 && i % 3 == 0) {
        result = ',' + result;
      }
      result = priceStr[charPos] + result;
    }

    return '₦$result';
  }

  /// Format price in shortened form
  /// Example: 4000000 -> ₦4.0M, 4000 -> ₦4.0K
  static String formatPriceShort(double price) {
    if (price >= 1000000) {
      return '₦${(price / 1000000).toStringAsFixed(1)}M';
    } else if (price >= 1000) {
      return '₦${(price / 1000).toStringAsFixed(0)}K';
    }
    return '₦${price.toStringAsFixed(0)}';
  }

  /// Format square feet with proper unit
  /// Example: 1919 -> 1,919 sqft
  static String formatSqft(double? sqft) {
    if (sqft == null || sqft <= 0) return 'N/A';

    final intSqft = sqft.toInt();
    final sqftStr = intSqft.toString();

    // Add comma separators
    String result = '';
    for (int i = 0; i < sqftStr.length; i++) {
      int charPos = sqftStr.length - i - 1;
      if (i > 0 && i % 3 == 0) {
        result = ',' + result;
      }
      result = sqftStr[charPos] + result;
    }

    return '$result sqft';
  }

  /// Format number with comma separation
  /// Example: 1000000 -> 1,000,000
  static String formatNumber(double number) {
    final intNum = number.toInt();
    final numStr = intNum.toString();

    String result = '';
    for (int i = 0; i < numStr.length; i++) {
      int charPos = numStr.length - i - 1;
      if (i > 0 && i % 3 == 0) {
        result = ',' + result;
      }
      result = numStr[charPos] + result;
    }

    return result;
  }
}

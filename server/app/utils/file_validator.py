import os
from werkzeug.utils import secure_filename

# File upload configuration
ALLOWED_EXTENSIONS = {
    "images": {"png", "jpg", "jpeg", "gif", "webp"},
    "documents": {"pdf", "doc", "docx", "txt", "rtf"},
    "archives": {"zip", "rar", "7z"},
    "audio": {"mp3", "wav", "ogg"},
    "video": {"mp4", "avi", "mov", "mkv"},
}

ALL_ALLOWED_EXTENSIONS = set()
for ext_set in ALLOWED_EXTENSIONS.values():
    ALL_ALLOWED_EXTENSIONS.update(ext_set)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB for images


def allowed_file(filename, file_type="any"):
    """Check if file extension is allowed"""
    if "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()

    if file_type == "any":
        return extension in ALL_ALLOWED_EXTENSIONS
    elif file_type in ALLOWED_EXTENSIONS:
        return extension in ALLOWED_EXTENSIONS[file_type]
    else:
        return False


def get_file_type(filename):
    """Determine file type based on extension"""
    if "." not in filename:
        return "unknown"

    extension = filename.rsplit(".", 1)[1].lower()

    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if extension in extensions:
            return file_type

    return "unknown"


def validate_file(file, max_size=MAX_FILE_SIZE, allowed_types="any"):
    """
    Validate uploaded file

    Args:
        file: Flask file object
        max_size: Maximum file size in bytes
        allowed_types: 'any' or specific type like 'images', 'documents'

    Returns:
        dict: {valid: bool, message: str, file_type: str}
    """
    if not file or not file.filename:
        return {"valid": False, "message": "No file provided", "file_type": None}

    # Check filename
    filename = secure_filename(file.filename)
    if not filename:
        return {"valid": False, "message": "Invalid filename", "file_type": None}

    # Check file extension
    if not allowed_file(filename, allowed_types):
        allowed_exts = (
            ALL_ALLOWED_EXTENSIONS
            if allowed_types == "any"
            else ALLOWED_EXTENSIONS.get(allowed_types, set())
        )
        return {
            "valid": False,
            "message": f'File type not allowed. Allowed types: {", ".join(sorted(allowed_exts))}',
            "file_type": None,
        }

    # Get file type
    file_type = get_file_type(filename)

    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)  # Reset file pointer

    # Special size limit for images
    if file_type == "images" and file_size > MAX_IMAGE_SIZE:
        return {
            "valid": False,
            "message": f"Image file too large. Maximum size: {MAX_IMAGE_SIZE / (1024*1024):.1f}MB",
            "file_type": file_type,
        }

    if file_size > max_size:
        return {
            "valid": False,
            "message": f"File too large. Maximum size: {max_size / (1024*1024):.1f}MB",
            "file_type": file_type,
        }

    return {"valid": True, "message": "File is valid", "file_type": file_type}

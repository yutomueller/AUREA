import base64
import hashlib
from cryptography.fernet import Fernet
from app.core.config import get_settings


def _fernet() -> Fernet:
    key_material = get_settings().secret_key.encode('utf-8')
    digest = hashlib.sha256(key_material).digest()
    return Fernet(base64.urlsafe_b64encode(digest))


def encrypt_value(value: str) -> str:
    if not value:
        return ''
    return _fernet().encrypt(value.encode('utf-8')).decode('utf-8')


def decrypt_value(value: str) -> str:
    if not value:
        return ''
    return _fernet().decrypt(value.encode('utf-8')).decode('utf-8')


def mask_value(value: str) -> str:
    if not value:
        return ''
    if len(value) <= 6:
        return '*' * len(value)
    return value[:3] + '*' * (len(value) - 6) + value[-3:]

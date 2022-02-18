"""
Base settings to build other settings files upon.
"""
from pathlib import Path

import environ

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
# redirink/
APPS_DIR = ROOT_DIR / "apps"
env = environ.Env()

# DJANGO_DEBUG can be only set by Docker (and Docker only will be used in production)
DEBUG = env.bool("DJANGO_DEBUG", True)

if DEBUG:
    # OS environment variables take precedence over variables from .env
    env.read_env(str(ROOT_DIR / ".env.dev"))

# General
TIME_ZONE = "Europe/Moscow"
LANGUAGE_CODE = "en-us"
SITE_ID = 1
USE_I18N = False
USE_L10N = False
USE_TZ = True

# Databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": str(ROOT_DIR / "db.sqlite3"),
        "ATOMIC_REQUESTS": True,
    }
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Urls
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# Apps
DJANGO_APPS = [
    # "django.contrib.auth",
    # "django.contrib.contenttypes",
    # "django.contrib.sessions",
    "django.contrib.sites",
    # "django.contrib.messages",
    "django.contrib.staticfiles",
    # "django.contrib.admin",
]
THIRD_PARTY_APPS = []
LOCAL_APPS = []
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# AUTHENTICATION
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#authentication-backends
# AUTHENTICATION_BACKENDS = [
#     "django.contrib.auth.backends.ModelBackend",
#     "allauth.account.auth_backends.AuthenticationBackend",
# ]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-user-model
# AUTH_USER_MODEL = "users.User"
# https://docs.djangoproject.com/en/dev/ref/settings/#login-redirect-url
# LOGIN_REDIRECT_URL = "users:redirect"
# https://docs.djangoproject.com/en/dev/ref/settings/#login-url
# LOGIN_URL = "account_login"

# # Callback will be handled by the react app
# GOOGLE_OAUTH_CALLBACK_URL = env(
#     "GOOGLE_OAUTH_CALLBACK_URL", default="http://localhost:9000/google/callback"
# )
# GOOGLE_OAUTH_CALLBACK_PATH = env(
#     "GOOGLE_OAUTH_CALLBACK_PATH", default="google/callback"
# )

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
# PASSWORD_HASHERS = [
#     # https://docs.djangoproject.com/en/dev/topics/auth/passwords/#using-argon2-with-django
#     "django.contrib.auth.hashers.Argon2PasswordHasher",
#     "django.contrib.auth.hashers.PBKDF2PasswordHasher",
#     "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
#     "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
# ]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-password-validators
# AUTH_PASSWORD_VALIDATORS = [
#     {
#         "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
#     },
#     {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
#     {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
#     {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
# ]

# MIDDLEWARE
# ------------------------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # "corsheaders.middleware.CorsMiddleware",
    # "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    # "django.contrib.auth.middleware.AuthenticationMiddleware",
    # "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.common.BrokenLinkEmailsMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# STATIC
# ------------------------------------------------------------------------------
STATIC_ROOT = str(ROOT_DIR / "staticfiles")
STATIC_URL = "/static/"
STATICFILES_DIRS = [str(APPS_DIR / "static")]
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

# MEDIA
# ------------------------------------------------------------------------------
MEDIA_ROOT = str(APPS_DIR / "media")
MEDIA_URL = "/media/"

# TEMPLATES
# ------------------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(APPS_DIR / "templates")],
        "OPTIONS": {
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]
FORM_RENDERER = "django.forms.renderers.TemplatesSetting"

# SECURITY
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-httponly
# SESSION_COOKIE_HTTPONLY = True
# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-httponly
# CSRF_COOKIE_HTTPONLY = True
# https://docs.djangoproject.com/en/dev/ref/settings/#secure-browser-xss-filter
# SECURE_BROWSER_XSS_FILTER = True
# https://docs.djangoproject.com/en/dev/ref/settings/#x-frame-options
# X_FRAME_OPTIONS = "DENY"

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
# EMAIL_BACKEND = env(
#     "DJANGO_EMAIL_BACKEND",
#     default="django.core.mail.backends.smtp.EmailBackend",
# )
# https://docs.djangoproject.com/en/dev/ref/settings/#email-timeout
# EMAIL_TIMEOUT = 5

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL.
# ADMIN_URL = "admin/"
# https://docs.djangoproject.com/en/dev/ref/settings/#admins
# ADMINS = [("""Egor Zorin""", "nezort11@gmail.com")]
# https://docs.djangoproject.com/en/dev/ref/settings/#managers
# MANAGERS = ADMINS

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {"level": "INFO", "handlers": ["console"]},
}


# django-rest-framework
# -------------------------------------------------------------------------------
# django-rest-framework - https://www.django-rest-framework.org/api-guide/settings/
# REST_FRAMEWORK = {
#     "DEFAULT_AUTHENTICATION_CLASSES": (
#         "rest_framework.authentication.SessionAuthentication",
#         "rest_framework.authentication.TokenAuthentication",
#     ),
#     "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
# }

# django-cors-headers - https://github.com/adamchainz/django-cors-headers#setup
# CORS_URLS_REGEX = r"^/api/.*$"
# CORS_ALLOW_ALL_ORIGINS = True
# Your stuff...
# ------------------------------------------------------------------------------

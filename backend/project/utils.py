import platform

def get_python_info():
    """Return basic Python environment information."""
    return {
        "python_version": platform.python_version(),
        "implementation": platform.python_implementation(),
        "system": platform.system(),
        "release": platform.release(),
    }

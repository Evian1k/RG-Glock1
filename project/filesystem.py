# Filesystem utilities

import os

def list_files(directory):
    """List all files in a directory."""
    return os.listdir(directory)


def file_exists(path):
    return os.path.isfile(path)

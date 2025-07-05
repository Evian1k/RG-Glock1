# API helper utilities

import json

def api_response(data, status=200):
    return {
        "status": status,
        "data": data
    }


def parse_json_request(request):
    try:
        return json.loads(request.data)
    except Exception:
        return None

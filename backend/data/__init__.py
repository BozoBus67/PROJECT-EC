import json
from pathlib import Path

_SHARED = Path(__file__).parent.parent.parent / "shared"


def _load(name: str):
  return json.loads((_SHARED / f"{name}.json").read_text())

import pytest
from unittest.mock import AsyncMock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

@pytest.fixture
def mock_redis():
    return AsyncMock()


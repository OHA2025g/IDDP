"""Tests for the FastAPI application."""

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_read_root():
    """Root endpoint returns Hello World message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_read_item():
    """Items endpoint returns item_id and optional query param."""
    response = client.get("/items/42")
    assert response.status_code == 200
    data = response.json()
    assert data["item_id"] == 42
    assert data["q"] is None


def test_read_item_with_query():
    """Items endpoint includes query string when provided."""
    response = client.get("/items/1?q=test")
    assert response.status_code == 200
    data = response.json()
    assert data["item_id"] == 1
    assert data["q"] == "test"


def test_read_item_invalid_id():
    """Items endpoint returns 422 for non-integer item_id."""
    response = client.get("/items/not-an-int")
    assert response.status_code == 422

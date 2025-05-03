"""merge heads

Revision ID: merge_heads
Revises: 49ab6eeb51f9, add_description_to_rooms
Create Date: 2024-03-21 12:05:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'merge_heads'
down_revision = ('49ab6eeb51f9', 'add_description_to_rooms')
branch_labels = None
depends_on = None

def upgrade() -> None:
    pass

def downgrade() -> None:
    pass 
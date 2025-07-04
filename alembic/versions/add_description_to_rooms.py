"""add description to rooms table

Revision ID: add_description_to_rooms
Revises: 66e3e3c14c7c
Create Date: 2024-03-21 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_description_to_rooms'
down_revision = '66e3e3c14c7c'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('rooms', sa.Column('description', sa.String(length=500), nullable=True))
    # ### end Alembic commands ###

def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('rooms', 'description')
    # ### end Alembic commands ### 
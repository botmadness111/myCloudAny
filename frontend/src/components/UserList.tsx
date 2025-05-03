import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { PersonRemove as PersonRemoveIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onRemoveUser?: (userId: number) => void;
  isAdmin?: boolean;
}

export const UserList: React.FC<UserListProps> = ({ users, onRemoveUser, isAdmin }) => {
  const { user } = useAuth();

  return (
    <List>
      {users.map((userItem) => (
        <ListItem key={userItem.id}>
          <ListItemText
            primary={userItem.username}
            secondary={userItem.email}
          />
          {isAdmin && userItem.id !== user?.id && onRemoveUser && (
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="remove user"
                onClick={() => onRemoveUser(userItem.id)}
              >
                <PersonRemoveIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
}; 
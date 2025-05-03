import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { FileData } from '../types';

interface FileListProps {
  files: FileData[];
  onDelete?: (fileId: number) => void;
  onDownload?: (fileId: number) => void;
  isAdmin?: boolean;
  isDownloading?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onDelete,
  onDownload,
  isAdmin = false,
  isDownloading = false,
}) => {
  console.log('FileList получил файлы:', files);

  if (!files.length) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        В этой комнате пока нет файлов
      </Typography>
    );
  }

  return (
    <Paper elevation={0} variant="outlined">
      <List>
        {files.map((file) => {
          console.log('Обработка файла:', file);
          return (
            <ListItem key={file.id}>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`Загружен: ${file.user?.username || 'Неизвестный пользователь'}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => onDownload && onDownload(file.id)}
                  sx={{ mr: 1 }}
                  disabled={isDownloading}
                >
                  {isDownloading ? <CircularProgress size={24} /> : <DownloadIcon />}
                </IconButton>
                {isAdmin && (
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => onDelete && onDelete(file.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}; 
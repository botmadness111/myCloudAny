import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileList } from '../components/FileList';
import { rooms } from '../services/api';
import { UserList } from '../components/UserList';
import { FileData, RoomDetailResponse } from '../types';
import { AxiosResponse } from 'axios';

export const RoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => auth.getCurrentUser().then(response => response.data),
  });

  const { data: roomData, isLoading, error } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      try {
        const response = await files.getAll(Number(id));
        console.log('Полный ответ от сервера:', response);
        console.log('Данные комнаты:', response.data);
        console.log('Файлы в комнате:', response.data?.files);
        return response.data;
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        throw err;
      }
    },
  });

  const deleteMutation = useMutation<AxiosResponse, Error, number>({
    mutationFn: (fileId: number) => files.delete(Number(id), fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', id] });
      queryClient.invalidateQueries({ queryKey: ['room', id] });
    },
  });

  const downloadMutation = useMutation<AxiosResponse, Error, number>({
    mutationFn: (fileId: number) => files.download(Number(id), fileId),
    onSuccess: (response) => {
      try {
        console.log('Заголовки ответа:', response.headers);
        const contentDisposition = response.headers['content-disposition'];
        console.log('Content-Disposition:', contentDisposition);
        let filename = 'file';
        
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          console.log('Matches:', matches);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const contentType = response.headers['content-type'];
        console.log('Content-Type:', contentType);
        
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Ошибка при обработке файла:', error);
        setErrorMessage('Ошибка при скачивании файла');
        setIsSnackbarOpen(true);
      }
    },
    onError: (error) => {
      console.error('Ошибка при скачивании:', error);
      setErrorMessage('Не удалось скачать файл');
      setIsSnackbarOpen(true);
    }
  });

  const uploadMutation = useMutation<AxiosResponse<FileData>, Error, File>({
    mutationFn: (file: File) => files.upload(Number(id), file),
    onSuccess: () => {
      console.log('Файл успешно загружен');
      queryClient.invalidateQueries({ queryKey: ['files', id] });
      queryClient.invalidateQueries({ queryKey: ['room', id] });
      queryClient.invalidateQueries({ queryKey: ['room'] });
    },
    onError: (error) => {
      console.error('Ошибка при загрузке файла:', error);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Загрузка файла:', file);
      uploadMutation.mutate(file);
    }
  };

  const handleDelete = (fileId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      deleteMutation.mutate(fileId);
    }
  };

  const handleDownload = (fileId: number) => {
    downloadMutation.mutate(fileId);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error('Ошибка при загрузке данных:', error);
    return <Typography color="error">Ошибка при загрузке файлов</Typography>;
  }

  console.log('Текущие данные комнаты:', roomData);
  console.log('Текущие файлы:', roomData?.files);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Файлы в комнате</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.status === 'pending'}
        >
          {uploadMutation.status === 'pending' ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Загрузка...
            </>
          ) : (
            'Загрузить файл'
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </Box>
      <FileList
        files={roomData?.files || []}
        onDelete={handleDelete}
        onDownload={handleDownload}
        isAdmin={roomData?.admin_id === currentUser?.id}
        isDownloading={downloadMutation.status === 'pending'}
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setIsSnackbarOpen(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 
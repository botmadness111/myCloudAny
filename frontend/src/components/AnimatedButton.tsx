import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'text' | 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  isIconButton?: boolean;
  style?: React.CSSProperties;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  tooltip,
  isIconButton = false,
  style,
}) => {
  const buttonProps = {
    onClick,
    variant,
    color,
    size,
    style,
  };

  const button = isIconButton ? (
    <IconButton {...buttonProps}>
      {children}
    </IconButton>
  ) : (
    <Button {...buttonProps}>
      {children}
    </Button>
  );

  const animatedButton = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {button}
    </motion.div>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      {animatedButton}
    </Tooltip>
  ) : animatedButton;
}; 
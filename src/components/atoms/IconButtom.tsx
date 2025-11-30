import React from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

// Es simplemente un botón de Ant Design envuelto.
const IconButton: React.FC<ButtonProps> = (props) => {
    return <Button {...props} />;
};

export default IconButton;
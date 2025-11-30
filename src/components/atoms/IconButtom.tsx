import React from 'react';
import { Button } from 'antd';
import type {ButtonProps} from 'antd';

const IconButton: React.FC<ButtonProps> = (props) => {
    return <Button {...props} />;
};

export default IconButton;

// Base component props
export interface BaseComponentProps {
    testID?: string;
    style?: any;
}

// FormInput props
export interface FormInputProps extends BaseComponentProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    disabled?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    required?: boolean;
}

// Button props
export interface ButtonProps extends BaseComponentProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
}

// Modal props
export interface ModalProps extends BaseComponentProps {
    visible: boolean;
    onRequestClose: () => void;
    title: string;
    children?: React.ReactNode;
}

// Card props
export interface CardProps extends BaseComponentProps {
    title?: string;
    children?: React.ReactNode;
    onPress?: () => void;
}

// List item props
export interface ListItemProps extends BaseComponentProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    onDelete?: () => void;
}

// Header props
export interface HeaderProps extends BaseComponentProps {
    title: string;
    showBackButton?: boolean;
}

// Loading props
export interface LoadingProps extends BaseComponentProps {
    size?: 'small' | 'medium' | 'large';
}

// Error state props
export interface ErrorStateProps extends BaseComponentProps {
    title: string;
    message: string;
    actionTitle?: string;
    onAction?: () => void;
}

// Search bar props
export interface SearchBarProps extends BaseComponentProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
}

// Select props
export interface SelectItem {
    label: string;
    value: string | number;
}

export interface SelectProps extends BaseComponentProps {
    items: SelectItem[];
    value?: string | number;
    onSelect: (value: string | number) => void;
}

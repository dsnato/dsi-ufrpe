// Base component props
export interface BaseComponentProps {
    testID?: string;
    style?: any;
    className?: string;
}

// FormInput props
export interface FormInputProps extends BaseComponentProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    disabled?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
    secureTextEntry?: boolean;
    editable?: boolean;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
    helperText?: string;
    icon?: string;
}

// Button props
export interface ButtonProps extends BaseComponentProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    icon?: string;
    iconPosition?: 'left' | 'right';
}

// ActionButton props
export interface ActionButtonProps extends BaseComponentProps {
    icon: string;
    onPress: () => void;
    label?: string;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    backgroundColor?: string;
}

// Modal props
export interface ModalProps extends BaseComponentProps {
    visible: boolean;
    onRequestClose: () => void;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    actions?: ModalAction[];
    dismissable?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
}

export interface ModalAction {
    title: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
}

// Card props
export interface CardProps extends BaseComponentProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    onPress?: () => void;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: number | { top?: number; bottom?: number; left?: number; right?: number };
}

// List item props
export interface ListItemProps extends BaseComponentProps {
    title: string;
    subtitle?: string;
    image?: string;
    icon?: string;
    onPress?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    rightElement?: React.ReactNode;
    badge?: string | number;
    divider?: boolean;
}

// Header props
export interface HeaderProps extends BaseComponentProps {
    title: string;
    subtitle?: string;
    leftIcon?: string;
    rightIcon?: string;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    showBackButton?: boolean;
    backgroundColor?: string;
}

// Input selector props
export interface InputSelectorProps extends BaseComponentProps {
    label?: string;
    placeholder?: string;
    value?: string;
    items: SelectItem[];
    onSelect: (item: SelectItem) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export interface SelectItem {
    label: string;
    value: string | number;
}

// Loading indicator props
export interface LoadingProps extends BaseComponentProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    message?: string;
}

// Error state props
export interface ErrorStateProps extends BaseComponentProps {
    title: string;
    message: string;
    icon?: string;
    actionTitle?: string;
    onAction?: () => void;
}

// Confirmation modal props
export interface ConfirmationModalProps extends BaseComponentProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDangerous?: boolean;
    loading?: boolean;
}

// Info card props
export interface InfoCardProps extends BaseComponentProps {
    title?: string;
    value?: string;
    unit?: string;
    icon?: string;
    color?: string;
    onPress?: () => void;
}

// Form select props
export interface FormSelectProps extends BaseComponentProps {
    label?: string;
    placeholder?: string;
    value?: string | number;
    items: SelectItem[];
    onSelect: (value: string | number) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    searchable?: boolean;
}

// Image picker props
export interface ImagePickerProps extends BaseComponentProps {
    onImageSelected: (imageUri: string) => void;
    onError?: (error: string) => void;
    maxSize?: number;
    format?: 'jpeg' | 'png' | 'webp';
}

// Toast/Notification props
export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top' | 'bottom' | 'center';
    action?: {
        label: string;
        onPress: () => void;
    };
}

// Drawer props
export interface DrawerProps extends BaseComponentProps {
    visible: boolean;
    onClose: () => void;
    items: DrawerItem[];
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export interface DrawerItem {
    label: string;
    icon?: string;
    onPress: () => void;
    badge?: string | number;
}

// Tabs props
export interface TabsProps extends BaseComponentProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    variant?: 'fixed' | 'scrollable';
}

export interface Tab {
    id: string;
    label: string;
    icon?: string;
    badge?: string | number;
}

// Search bar props
export interface SearchBarProps extends BaseComponentProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    onSearch?: (text: string) => void;
    onClear?: () => void;
    disabled?: boolean;
}

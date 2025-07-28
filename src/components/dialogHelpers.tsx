import React, { useState } from "react";
import Dialog from "./dialog";

interface DialogConfig {
	visible: boolean;
	title: string;
	message: string;
	primaryButton?: {
		text: string;
		onPress: () => void;
		style?: "primary" | "danger" | "success";
	};
	secondaryButton?: {
		text: string;
		onPress: () => void;
		style?: "outline" | "text";
	};
	showCloseButton: boolean;
}

// Hook để sử dụng Dialog dễ dàng hơn
export const useDialog = () => {
	const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
		visible: false,
		title: "",
		message: "",
		primaryButton: undefined,
		secondaryButton: undefined,
		showCloseButton: true,
	});

	const showDialog = (config: Partial<DialogConfig>) => {
		setDialogConfig((prev) => ({
			...prev,
			...config,
			visible: true,
		}));
	};

	const hideDialog = () => {
		setDialogConfig((prev) => ({
			...prev,
			visible: false,
		}));
	};

	const DialogComponent = () => (
		<Dialog {...dialogConfig} onClose={hideDialog} />
	);

	return {
		showDialog,
		hideDialog,
		Dialog: DialogComponent,
	};
};

// Pre-configured dialogs cho các tình huống phổ biến
export const DialogTemplates = {
	// Confirm đăng xuất
	logout: (onConfirm: () => void, onCancel?: () => void) => ({
		title: "Đăng xuất",
		message: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?",
		type: "confirm" as const,
		icon: "log-out-outline",
		primaryButton: {
			text: "Đăng xuất",
			onPress: onConfirm,
			style: "danger" as const,
		},
		secondaryButton: {
			text: "Hủy",
			onPress: onCancel || (() => {}),
			style: "outline" as const,
		},
	}),

	// Yêu cầu đăng nhập
	requireLogin: (onLogin: () => void, onCancel?: () => void) => ({
		title: "Yêu cầu đăng nhập",
		message: "Bạn cần phải đăng nhập để sử dụng tính năng này.",
		primaryButton: {
			text: "Đăng nhập",
			onPress: onLogin,
			style: "primary" as const,
		},
		secondaryButton: {
			text: "Hủy",
			onPress: onCancel || (() => {}),
			style: "outline" as const,
		},
	}),

	// Confirm xóa
	delete: (
		itemName: string,
		onConfirm: () => void,
		onCancel?: () => void
	) => ({
		title: "Xóa " + itemName,
		message: `Bạn có chắc chắn muốn xóa ${itemName} này không? Hành động này không thể hoàn tác.`,
		type: "warning" as const,
		icon: "trash-outline",
		primaryButton: {
			text: "Xóa",
			onPress: onConfirm,
			style: "danger" as const,
		},
		secondaryButton: {
			text: "Hủy",
			onPress: onCancel || (() => {}),
			style: "outline" as const,
		},
	}),

	// Thông báo thành công
	success: (title: string, message: string, onOk?: () => void) => ({
		title,
		message,
		type: "info" as const,
		icon: "checkmark-circle-outline",
		primaryButton: {
			text: "OK",
			onPress: onOk || (() => {}),
			style: "success" as const,
		},
	}),

	// Thông báo lỗi
	error: (title: string, message: string, onOk?: () => void) => ({
		title,
		message,
		type: "alert" as const,
		icon: "alert-circle-outline",
		primaryButton: {
			text: "OK",
			onPress: onOk || (() => {}),
			style: "danger" as const,
		},
	}),

	// Confirm chung
	confirm: (
		title: string,
		message: string,
		onConfirm: () => void,
		onCancel?: () => void
	) => ({
		title,
		message,
		type: "confirm" as const,
		primaryButton: {
			text: "Xác nhận",
			onPress: onConfirm,
			style: "primary" as const,
		},
		secondaryButton: {
			text: "Hủy",
			onPress: onCancel || (() => {}),
			style: "outline" as const,
		},
	}),
};

export default Dialog;

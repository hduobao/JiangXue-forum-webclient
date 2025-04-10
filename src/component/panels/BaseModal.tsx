import { IconX } from "@tabler/icons-react";
import { ReactNode } from "react";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  height?: string;
};

const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  height = "h-[500px]",
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl w-full ${maxWidth} ${height} flex flex-col`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
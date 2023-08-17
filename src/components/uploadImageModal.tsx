import { Modal } from "./common/modal";
import { useModal } from "./hooks/modalcontext";

export const UploadImageModal = () => {
  const { isModalOpened, closeModal } = useModal();
  console.log(isModalOpened);
  return (
    <div>
      <Modal isModalOpened={isModalOpened} closeModal={closeModal}>
        UploadImageModal
      </Modal>
    </div>
  );
};

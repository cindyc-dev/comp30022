import { Layout } from "~/components/layout/layout";
import { Board } from "./_board";
import { FaPlusCircle } from "react-icons/fa";
import { useModal } from "~/components/hooks/modalContext";
import { AddTaskModalContent } from "./_addTaskModalContent";

export default function Trello() {
  const { openModal } = useModal();

  const handleAddTask = () => {
    openModal({
      content: <AddTaskModalContent />,
      id: "add-task-modal",
    });
  };
  return (
    <Layout>
      <div className="flex w-full flex-col ">
        <button className="btn btn-primary" onClick={handleAddTask}>
          <FaPlusCircle />
          Add Task
        </button>
        <Board />
      </div>
    </Layout>
  );
}

Trello.auth = false;

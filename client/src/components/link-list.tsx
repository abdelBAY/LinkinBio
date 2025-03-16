import { Link } from "@shared/schema";
import { LinkCard } from "./link-card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LinkListProps {
  links: Link[];
  profileId: number;
}

export function LinkList({ links, profileId }: LinkListProps) {
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update orders
    const updates = items.map((link, index) => 
      apiRequest("PATCH", `/api/links/${link.id}`, { order: index })
    );

    await Promise.all(updates);
    queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}/links`] });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="links" mode="vertical" type="DEFAULT">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3 max-w-xl mx-auto mt-6"
          >
            {links.map((link, index) => (
              <Draggable key={link.id} draggableId={String(link.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <LinkCard link={link} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

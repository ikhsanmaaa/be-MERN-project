export function serializeEvent(event: any) {
  if (!event) return event;

  return {
    _id: event._id,
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    banner: event.banner,
    category: event.category,
    isFeatured: event.isFeatured,
    isOnline: event.isOnline,
    isPublish: event.isPublish,
    description: event.description,
    slug: event.slug,
    location: event.location,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export function serializeEventArray(events: any[]) {
  if (!events) return events;

  return events.map((event) => ({
    _id: event._id,
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    banner: event.banner,
    category: event.category,
    isFeatured: event.isFeatured,
    isOnline: event.isOnline,
    isPublish: event.isPublish,
    description: event.description,
    slug: event.slug,
    location: event.location,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));
}

export function formatSalary(salary: string): string {
  return salary;
}

export function daysUntil(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function timeAgo(dateString: string): string {
  if (!dateString) return 'Recently';
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Format time portion for display
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const timeStr = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;

  if (days === 0) return `Today at ${timeStr}`;
  if (days === 1) return `Yesterday at ${timeStr}`;
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function getTypeBadgeClass(type: string): string {
  const map: Record<string, string> = {
    job: 'badge-job',
    internship: 'badge-internship',
    scholarship: 'badge-scholarship',
    fellowship: 'badge-fellowship',
    volunteer: 'badge-volunteer',
    graduate_program: 'badge-graduate_program',
  };
  return map[type] || 'badge-job';
}

export function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    job: 'Job',
    internship: 'Internship',
    scholarship: 'Scholarship',
    fellowship: 'Fellowship',
    volunteer: 'Volunteer',
    graduate_program: 'Graduate Program',
  };
  return map[type] || type;
}

export function formatLocation(loc: any): string {
  if (!loc) return 'Unknown';
  if (typeof loc === 'string') return loc;
  const parts = [loc.city, loc.state, loc.country].filter(Boolean);
  return parts.join(', ') || 'Unknown';
}

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

export function getCategoryIcon(type: string): string {
  const map: Record<string, string> = {
    job: 'fa-briefcase',
    internship: 'fa-laptop-code',
    scholarship: 'fa-graduation-cap',
    fellowship: 'fa-trophy',
    volunteer: 'fa-hands-helping',
    graduate_program: 'fa-user-graduate',
  };
  return map[type] || 'fa-briefcase';
}

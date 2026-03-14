/**
 * EmptyState Component
 * Reusable empty state message for when no data is available
 * Reduces ~40 LOC of repeated inline empty state HTML across the app
 *
 * @param {Object} props
 * @param {ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Primary message
 * @param {string} props.description - Secondary descriptive text
 * @param {ReactNode} props.action - Optional action button/link
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
      {icon && <div className="text-gray-300 mx-auto mb-4 flex justify-center">{icon}</div>}
      {title && <p className="text-gray-900 text-lg font-semibold mb-2">{title}</p>}
      {description && <p className="text-gray-600 text-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

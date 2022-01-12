import { useApplications } from 'hooks/use-application';

const GrantsList = () => {
  const { getActiveApplications } = useApplications();
  const definitions = getActiveApplications();

  return (
    <div>
      <ul>
        {[...definitions].map(([identifier, definition]) => {
          return (
            <li>
              <a href={`/apply/${identifier}`}>{definition.name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GrantsList;

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import './Avatar.scss';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = ({ name, src, size = 'md' }: AvatarProps) => {
  // Generate initials from name (first letter of first and last name)
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <BaseAvatar.Root className={`avatar avatar--${size}`}>
      {src && <BaseAvatar.Image src={src} alt={name} />}
      <BaseAvatar.Fallback className="avatar__fallback">
        {getInitials(name)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
};

export default Avatar;

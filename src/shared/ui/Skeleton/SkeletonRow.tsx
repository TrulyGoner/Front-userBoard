import { SKELETON_WIDTHS } from '../../constants/UserTable';
import './Skeleton.css';

export function SkeletonRow() {
  return (
    <div className="ut-row ut-row--skeleton">
      {SKELETON_WIDTHS.map((w, i) => (
        <div key={i} className="ut-cell">
          <span className="ut-skeleton" style={{ width: w }} />
        </div>
      ))}
      <div className="ut-cell ut-cell--actions" />
    </div>
  );
}

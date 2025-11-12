import React from 'react';
import { Card, Skeleton } from 'antd';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'list' | 'table' | 'detail';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 1, type = 'card' }) => {
  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="loading-skeleton-card">
            <Skeleton.Image active className="skeleton-image" />
            <Skeleton active paragraph={{ rows: 3 }} className="skeleton-content" />
          </Card>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <div className="loading-skeleton-list">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-list-item">
            <Skeleton.Avatar active size={64} />
            <div className="skeleton-list-content">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="loading-skeleton-table">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="loading-skeleton-detail">
        <Skeleton.Image active className="skeleton-detail-image" />
        <div className="skeleton-detail-content">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;

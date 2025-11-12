import React from 'react';
import { Card, Tag, Button, Rate } from 'antd';
import { PlayCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

interface MovieCardProps {
  id: number;
  filmName: string;
  filmDescription: string;
  poster: Buffer | string;
  backdrop?: Buffer | string;
  premiere: Date | string;
  trailer?: string;
  categories?: string;
  rating?: number;
  isActive: number;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  filmName,
  filmDescription,
  poster,
  premiere,
  categories,
  rating,
  onClick,
}) => {
  const navigate = useNavigate();

  const getPosterUrl = () => {
    if (typeof poster === 'string') {
      return poster.startsWith('data:') ? poster : `data:image/jpeg;base64,${poster}`;
    }
    return poster ? `data:image/jpeg;base64,${poster.toString('base64')}` : '/placeholder-poster.jpg';
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/film/${id}`);
    }
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book/${id}`);
  };

  return (
    <Card
      hoverable
      className="movie-card"
      cover={
        <div className="movie-card-cover">
          <img
            alt={filmName}
            src={getPosterUrl()}
            className="movie-card-image"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-poster.jpg';
            }}
          />
          <div className="movie-card-overlay">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleCardClick}
              className="movie-card-play-btn"
            >
              View Details
            </Button>
            <Button
              type="default"
              size="large"
              onClick={handleBookNow}
              className="movie-card-book-btn"
            >
              Book Now
            </Button>
          </div>
        </div>
      }
      onClick={handleCardClick}
    >
      <Meta
        title={
          <div className="movie-card-title">
            <h3>{filmName}</h3>
            {rating && <Rate disabled defaultValue={rating} className="movie-card-rating" />}
          </div>
        }
        description={
          <div className="movie-card-description">
            <p className="movie-card-synopsis">
              {filmDescription.length > 100
                ? `${filmDescription.substring(0, 100)}...`
                : filmDescription}
            </p>
            <div className="movie-card-meta">
              <div className="movie-card-date">
                <CalendarOutlined />
                <span>{formatDate(premiere)}</span>
              </div>
              {categories && (
                <div className="movie-card-categories">
                  {categories.split(',').map((cat, idx) => (
                    <Tag key={idx} color="blue">
                      {cat.trim()}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default MovieCard;

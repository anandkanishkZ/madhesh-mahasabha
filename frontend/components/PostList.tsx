import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
}

interface PostListProps {
  posts: Post[];
  limit?: number;
  showTag?: boolean;
}

export function PostList({ posts, limit, showTag = true }: PostListProps) {
  const displayPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayPosts.map((post) => (
        <Card key={post.slug} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            {showTag && (
              <div className="flex items-center mb-2">
                <span className="inline-block bg-mm-primary/10 text-mm-primary px-2 py-1 rounded text-sm font-medium">
                  {post.tag}
                </span>
              </div>
            )}
            <CardTitle as="h3">
              <Link 
                href={`/news/${post.slug}`}
                className="hover:text-mm-primary transition-colors focus-ring rounded-sm"
              >
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="nepali-text text-gray-600 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <time 
                dateTime={post.date}
                className="text-sm text-gray-500 nepali-text"
              >
                {formatDate(post.date)}
              </time>
              <Link 
                href={`/news/${post.slug}`}
                className="text-mm-primary hover:underline font-medium text-sm focus-ring rounded-sm"
              >
                पूर्ण पढ्नुहोस् →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { client, getLoveLetterByIdQuery } from "@/lib/sanity";

interface LoveLetterDetail {
  _id: string;
  title: string;
  content: any;
  theme?: {
    primaryColor: string;
    fontFamily: string;
    animation: string;
  };
  effects?: string[];
  isPrivate: boolean;
  createdAt: string;
  animations?: {
    openingEffect: 'fold' | 'fade' | 'butterfly' | 'hearts';
    backgroundEffect: 'particles' | 'petals' | 'stars' | 'none';
  };
}

const LoveLetterDetail = () => {
  const { id } = useParams();

  const { data: letter, isLoading, isError } = useQuery<LoveLetterDetail>({
    queryKey: ['letter', id],
    queryFn: () => client.fetch(getLoveLetterByIdQuery, { id }),
    enabled: !!id
  });

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  if (isError || !letter) {
    return <div className="min-h-screen grid place-items-center">Letter not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-pink dark:prose-invert">
        <h1>{letter.title}</h1>
        <div className="mt-8">
          {Array.isArray(letter.content) 
            ? letter.content.map((block: any, i: number) => 
                block.children?.map((child: any, j: number) => 
                  <p key={`${i}-${j}`}>{child.text}</p>
                ))
            : letter.content}
        </div>
      </div>
    </div>
  );
};

export default LoveLetterDetail;

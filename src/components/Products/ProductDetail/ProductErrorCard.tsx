import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProductErrorCardProps {
  error: string;
}

export default function ProductErrorCard({ error }: ProductErrorCardProps) {
  return (
    <div className='flex items-center justify-center min-h-[400px] p-4 md:p-6'>
      <Card className='w-full max-w-md'>
        <CardContent className='flex flex-col items-center justify-center py-10 text-center'>
          <div className='rounded-full bg-destructive/10 p-3 mb-4'>
            <AlertCircle className='h-6 w-6 text-destructive' />
          </div>
          <h2 className='text-lg font-semibold mb-2'>Error Loading Product</h2>
          <p className='text-sm text-muted-foreground'>{error}</p>
        </CardContent>
      </Card>
    </div>
  );
}

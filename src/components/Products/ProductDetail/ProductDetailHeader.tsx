import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface ProductDetailHeaderProps {
  onBack: () => void;
  onSave: () => void;
  onDelete: () => void;
  hasChanges: boolean;
}

export default function ProductDetailHeader({
  onBack,
  onSave,
  onDelete,
  hasChanges,
}: ProductDetailHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b'>
      <div className='flex items-center gap-3'>
        <Button variant='outline' size='icon' onClick={onBack} className='h-10 w-10 shrink-0'>
          <ArrowLeft className='size-4' />
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Product Details</h1>
          <p className='text-sm text-muted-foreground'>
            View and edit product information
          </p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          className='gap-2 text-destructive hover:text-destructive'
          onClick={onDelete}
        >
          <Trash2 className='size-4' />
          Delete
        </Button>
        <Button
          className='gap-2'
          onClick={onSave}
          disabled={!hasChanges}
        >
          <Save className='size-4' />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

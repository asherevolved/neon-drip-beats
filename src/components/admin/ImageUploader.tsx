import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload, RotateCcw, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  progress: number;
  error?: string;
  isUploading: boolean;
}

interface ImageUploaderProps {
  bucketName: string;
  maxSize?: number; // in MB
  maxWidth?: number; // in pixels
  quality?: number; // 0-1
  allowMultiple?: boolean;
  allowReorder?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  className?: string;
  placeholder?: string;
}

const MAX_FILE_SIZE_MB = 12;
const MAX_WIDTH_PX = 2560;
const DEFAULT_QUALITY = 0.8;

export function ImageUploader({
  bucketName,
  maxSize = MAX_FILE_SIZE_MB,
  maxWidth = MAX_WIDTH_PX,
  quality = DEFAULT_QUALITY,
  allowMultiple = false,
  allowReorder = false,
  value,
  onChange,
  className = '',
  placeholder = 'Click to upload or drag and drop'
}: ImageUploaderProps) {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize image files from value
  React.useEffect(() => {
    const urls = Array.isArray(value) ? value : value ? [value] : [];
    const files = urls.map((url, index) => ({
      id: `existing-${index}`,
      url,
      progress: 100,
      isUploading: false
    }));
    setImageFiles(files);
  }, [value]);

  const resizeImage = useCallback((file: File, maxWidth: number, quality: number): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        
        if (width <= maxWidth) {
          resolve(file);
          return;
        }
        
        const ratio = maxWidth / width;
        canvas.width = maxWidth;
        canvas.height = height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Only JPG, PNG, and WebP files are allowed';
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    
    return null;
  };

  const uploadImage = async (file: File, imageId: string) => {
    try {
      const resizedFile = await resizeImage(file, maxWidth, quality);
      
      const fileExt = resizedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setImageFiles(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, isUploading: true, progress: 0 }
          : img
      ));

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, resizedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setImageFiles(prev => {
        const updatedFiles = prev.map(img => 
          img.id === imageId 
            ? { ...img, url: data.publicUrl, progress: 100, isUploading: false, error: undefined }
            : img
        );
        
        // Update parent component with the new state
        const urls = updatedFiles.filter(f => f.url && !f.error).map(f => f.url);
        if (allowMultiple) {
          onChange(urls);
        } else {
          onChange(urls[0] || '');
        }
        
        return updatedFiles;
      });

      return data.publicUrl;
    } catch (error) {
      setImageFiles(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, error: 'Upload failed', isUploading: false, progress: 0 }
          : img
      ));
      
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      
      return null;
    }
  };

  const updateParent = (files: ImageFile[]) => {
    const urls = files.filter(f => f.url && !f.error).map(f => f.url);
    if (allowMultiple) {
      onChange(urls);
    } else {
      onChange(urls[0] || '');
    }
  };

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (!allowMultiple && fileArray.length > 1) {
      toast({
        title: "Multiple Files",
        description: "Only one file is allowed",
        variant: "destructive",
      });
      return;
    }

    const validFiles = fileArray.filter(file => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${error}`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // If single file mode, replace existing
    if (!allowMultiple) {
      const newFile: ImageFile = {
        id: `new-${Date.now()}`,
        file: validFiles[0],
        url: URL.createObjectURL(validFiles[0]),
        progress: 0,
        isUploading: false
      };
      setImageFiles([newFile]);
      uploadImage(validFiles[0], newFile.id);
    } else {
      // Add to existing files
      const newFiles = validFiles.map(file => ({
        id: `new-${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
        progress: 0,
        isUploading: false
      }));
      
      setImageFiles(prev => {
        const updatedFiles = [...prev, ...newFiles];
        return updatedFiles;
      });
      
      newFiles.forEach(file => {
        if (file.file) {
          uploadImage(file.file, file.id);
        }
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (id: string) => {
    setImageFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id);
      
      // Update parent component with the new state
      const urls = newFiles.filter(f => f.url && !f.error).map(f => f.url);
      if (allowMultiple) {
        onChange(urls);
      } else {
        onChange(urls[0] || '');
      }
      
      return newFiles;
    });
  };

  const retryUpload = (id: string) => {
    const file = imageFiles.find(f => f.id === id);
    if (file?.file) {
      uploadImage(file.file, id);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      
      // Update parent component with the new state
      const urls = newFiles.filter(f => f.url && !f.error).map(f => f.url);
      if (allowMultiple) {
        onChange(urls);
      } else {
        onChange(urls[0] || '');
      }
      
      return newFiles;
    });
  };

  const totalProgress = imageFiles.length > 0 
    ? Math.round(imageFiles.reduce((sum, file) => sum + file.progress, 0) / imageFiles.length)
    : 0;

  const hasUploading = imageFiles.some(f => f.isUploading);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${hasUploading ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !hasUploading && fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-1">{placeholder}</p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP up to {maxSize}MB • Max {maxWidth}px width
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={allowMultiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        />
      </div>

      {/* Overall Progress */}
      {hasUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} />
        </div>
      )}

      {/* Image Previews */}
      {imageFiles.length > 0 && (
        <div className={`grid gap-4 ${allowMultiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {imageFiles.map((imageFile, index) => (
            <div key={imageFile.id} className="relative group">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageFile.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Loading overlay */}
                {imageFile.isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Progress value={imageFile.progress} className="w-16 mb-2" />
                      <span className="text-xs">{imageFile.progress}%</span>
                    </div>
                  </div>
                )}
                
                {/* Error overlay */}
                {imageFile.error && (
                  <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => retryUpload(imageFile.id)}
                      className="bg-background"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {allowReorder && imageFiles.length > 1 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
                      onMouseDown={(e) => {
                        // Simple drag implementation - in production you might want react-beautiful-dnd
                        const startY = e.clientY;
                        const handleMouseMove = (e: MouseEvent) => {
                          const deltaY = e.clientY - startY;
                          if (Math.abs(deltaY) > 50) {
                            const newIndex = deltaY > 0 ? Math.min(index + 1, imageFiles.length - 1) : Math.max(index - 1, 0);
                            if (newIndex !== index) {
                              moveImage(index, newIndex);
                            }
                            document.removeEventListener('mousemove', handleMouseMove);
                          }
                        };
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                        }, { once: true });
                      }}
                    >
                      <GripVertical className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0"
                    onClick={() => removeImage(imageFile.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {imageFile.error && (
                <p className="text-xs text-destructive mt-1">{imageFile.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
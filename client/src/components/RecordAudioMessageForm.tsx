import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface RecordAudioMessageFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RecordAudioMessageForm({ onSuccess, onCancel }: RecordAudioMessageFormProps) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up the audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update audio URL when blob changes
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.src = url;
      }
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak your message now...",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access your microphone. Please check your browser permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast({
        title: "Recording stopped",
        description: "Your message has been recorded.",
      });
    }
  };

  // Play/pause recorded audio
  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !audioBlob) {
      toast({
        title: "Error",
        description: "Please provide a title and record an audio message",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For a real implementation, we would upload the audio file to Sanity here
      // Since we can't directly integrate with the Sanity asset upload in this demo,
      // we'll use a placeholder URL for the audio
      
      const audioMessage = {
        title,
        audioUrl: audioUrl || 'https://example.com/placeholder-audio.mp3',
        caption: caption || undefined,
        description: description || undefined,
        duration: recordingTime
      };
      
      // Send to API
      const response = await apiRequest('/api/audio-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(audioMessage)
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Your audio message has been sent!",
        variant: "default"
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/audio-messages'] });
      
      // Reset form and call success callback
      setTitle('');
      setCaption('');
      setDescription('');
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error sending audio message:', error);
      toast({
        title: "Error",
        description: "Failed to send your audio message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-pink-200 shadow-lg">
      <CardHeader className="bg-pink-50 rounded-t-lg">
        <CardTitle className="text-2xl font-serif text-pink-800">Record an Audio Message</CardTitle>
        <CardDescription>Send your voice to express your feelings</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-pink-700">Title</Label>
            <Input
              id="title"
              placeholder="Give your message a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-pink-700">Caption (optional)</Label>
            <Input
              id="caption"
              placeholder="Add a short caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-pink-700">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details about your message..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          
          <div className="bg-pink-50 p-4 rounded-md mt-4">
            <div className="text-center mb-4">
              <p className="text-pink-700 font-medium">
                {isRecording 
                  ? `Recording... ${formatTime(recordingTime)}`
                  : audioBlob 
                    ? `Recorded: ${formatTime(recordingTime)}`
                    : "Ready to record your message"
                }
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              {!audioBlob ? (
                <>
                  {!isRecording ? (
                    <Button
                      type="button"
                      onClick={startRecording}
                      className="bg-red-500 hover:bg-red-600 text-white flex items-center"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={stopRecording}
                      className="bg-gray-600 hover:bg-gray-700 text-white flex items-center"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={togglePlayback}
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50 flex items-center"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setRecordingTime(0);
                    }}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Discard & Re-record
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-pink-100 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isSubmitting || !audioBlob}
          >
            {isSubmitting ? "Sending..." : "Send Voice Message"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default RecordAudioMessageForm;
"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ArrowLeft, Download, Maximize2, ZoomIn, ZoomOut, Search, Share2, MoreVertical, FileText, Minimize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Setup the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerClientProps {
  document: any;
  subject: any;
}

export function PdfViewerClient({ document, subject }: PdfViewerClientProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!window.document.fullscreenElement);
    };
    window.document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => window.document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    // Basic trick to find marks after render
    const timer = setTimeout(() => {
      const marks = containerRef.current?.querySelectorAll('mark');
      if (marks) {
        setMatchCount(marks.length);
        if (marks.length > 0 && currentMatch > 0) {
          marks.forEach(m => m.style.backgroundColor = 'yellow');
          const activeMark = marks[currentMatch - 1];
          if (activeMark) {
            activeMark.style.backgroundColor = 'orange';
            activeMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } else {
        setMatchCount(0);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText, currentMatch, pageNumber]);

  const toggleFullscreen = () => {
    if (!window.document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      window.document.exitFullscreen();
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (window.innerWidth < 768) {
      setScale(0.6);
    } else {
      setScale(1.0);
    }
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  useEffect(() => {
    if (!numPages || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute('data-page-number'));
            if (pageNum && pageNum !== pageNumber) {
              setPageNumber(pageNum);
            }
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    // Timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      const pageElements = containerRef.current?.querySelectorAll('[data-page-number]');
      pageElements?.forEach(el => observer.observe(el));
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [numPages, scale]); // Re-observe if scale changes

  const scrollToPage = (pageNum: number) => {
    const pageEl = containerRef.current?.querySelector(`[data-page-number="${pageNum}"]`);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPrevPage = () => {
    const prev = Math.max(pageNumber - 1, 1);
    scrollToPage(prev);
  };
  
  const goToNextPage = () => {
    const next = Math.min(pageNumber + 1, numPages || 1);
    scrollToPage(next);
  };

  const handleSearchNext = () => setCurrentMatch(prev => prev < matchCount ? prev + 1 : 1);
  const handleSearchPrev = () => setCurrentMatch(prev => prev > 1 ? prev - 1 : matchCount);

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.name || 'document.pdf';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const [shareFile, setShareFile] = useState<File | null>(null);

  const prefetchShareFile = async () => {
    if (shareFile) return;
    try {
      const response = await fetch(document.fileUrl);
      const blob = await response.blob();
      setShareFile(new File([blob], document.name || 'document.pdf', { type: 'application/pdf' }));
    } catch (e) {
      // Ignore prefetch errors
    }
  };

  const handleShare = async () => {
    try {
      if (shareFile && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
        await navigator.share({
          files: [shareFile],
          title: document.name,
          text: `Sharing: ${document.name}`,
        });
      } else {
        const text = encodeURIComponent(`Sharing: ${document.name}\n${window.location.origin}${document.fileUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // User canceled the native share dialog
      }
      // Do not console.error to avoid Next.js dev overlay intercepting it.
      // Fallback cleanly to WhatsApp Web link.
      const text = encodeURIComponent(`Sharing: ${document.name}\n${window.location.origin}${document.fileUrl}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  // Basic highlight function provided by react-pdf
  const highlightPattern = (text: string, pattern: string) => {
    if (!pattern) return text;
    return text.replace(new RegExp(pattern, 'gi'), match => `<mark>${match}</mark>`);
  };

  const textRenderer = (textItem: any) => highlightPattern(textItem.str, searchText);

  return (
    <div ref={viewerRef} className="fixed inset-0 z-50 flex flex-col bg-gray-50 fullscreen-override">
      <style jsx global>{`
        .fullscreen-override:fullscreen {
          height: 100vh;
          margin: 0;
          background: #f9fafb;
        }
      `}</style>
      
      {/* Viewer Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20 shrink-0 gap-y-2">
        <div className="flex items-center gap-4 min-w-0">
          <Link 
            href={`/subjects/${subject.slug}`}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 hidden sm:flex">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{document.name}</h1>
              <p className="text-xs text-gray-500 truncate hidden sm:block">
                {subject.name} • {document.unit || 'General'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto sm:ml-4">
          <div className="flex items-center gap-1 mr-1 sm:mr-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button onClick={zoomOut} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors" disabled={scale <= 0.5}>
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium px-1 sm:px-2 text-gray-700 w-[45px] text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors" disabled={scale >= 3.0}>
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative flex items-center">
            {showSearch && (
              <div className="absolute right-full mr-2 flex items-center bg-white border border-gray-200 rounded-md shadow-sm animate-in fade-in slide-in-from-right-2">
                <input 
                  type="text" 
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setCurrentMatch(e.target.value ? 1 : 0); }}
                  placeholder="Find..." 
                  className="px-3 py-1.5 text-sm outline-none rounded-l-md w-32 sm:w-48"
                  autoFocus
                />
                {searchText && (
                  <span className="text-xs text-gray-400 px-2 border-l border-gray-100">
                    {matchCount > 0 ? `${currentMatch}/${matchCount}` : '0/0'}
                  </span>
                )}
                <div className="flex border-l border-gray-100">
                  <button onClick={handleSearchPrev} disabled={matchCount === 0} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleSearchNext} disabled={matchCount === 0} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => { setShowSearch(false); setSearchText(""); setMatchCount(0); setCurrentMatch(0); }} className="p-1.5 text-gray-400 hover:text-gray-700 border-l border-gray-100 rounded-r-md hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
          
          <button onClick={toggleFullscreen} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors hidden sm:block">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
          <button 
            onClick={handleShare} 
            onMouseEnter={prefetchShareFile}
            onTouchStart={prefetchShareFile}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={handleDownload} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-gray-900"
      >
        <Document
          file={document.fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-white mt-10">Loading PDF...</div>
          }
          error={
            <div className="text-white mt-10">Failed to load PDF. Please make sure the file exists.</div>
          }
        >
          {Array.from(new Array(numPages || 0), (el, index) => (
            <div key={index} data-page-number={index + 1} className="mb-4 shadow-xl">
              <Page 
                pageNumber={index + 1} 
                scale={scale} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
                customTextRenderer={textRenderer}
              />
            </div>
          ))}
        </Document>
      </div>
      
      {/* Viewer Footer / Page Navigation */}
      <div className="bg-white border-t border-gray-200 p-3 flex items-center justify-center gap-4 shrink-0 z-20">
        <button 
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-sm text-gray-600 font-medium">
          Page {pageNumber} of {numPages || '-'}
        </span>
        <button 
          onClick={goToNextPage}
          disabled={numPages === null || pageNumber >= numPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

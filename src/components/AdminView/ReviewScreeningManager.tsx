import React, { useState } from 'react';
import {
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
  Trash2,
  Send,
  User,
  Building2,
  Calendar,
  Check,
  Ban,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { GuestReview, ReviewScreeningStatus, Reservation, Room } from '../../types';

interface ReviewScreeningManagerProps {
  reviews: GuestReview[];
  reservations: Reservation[];
  rooms: Room[];
  onUpdateReview: (updatedReview: GuestReview) => void;
  onDeleteReview: (reviewId: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ReviewScreeningManager: React.FC<ReviewScreeningManagerProps> = ({
  reviews,
  reservations,
  rooms,
  onUpdateReview,
  onDeleteReview,
  onShowToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<ReviewScreeningStatus | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [rejectModalReview, setRejectModalReview] = useState<GuestReview | null>(null);
  const [rejectReason, setRejectReason] = useState('Unverified Non-Guest / Spam');
  const [rejectCustomNote, setRejectCustomNote] = useState('');

  // Metrics
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter((r) => r.screeningStatus === 'pending');
  const approvedReviews = reviews.filter((r) => r.screeningStatus === 'approved');
  const rejectedReviews = reviews.filter((r) => r.screeningStatus === 'rejected' || r.screeningStatus === 'flagged');

  const avgRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  // Helper: check if booking code matches any reservation
  const checkVerifiedReservation = (bookingCode?: string, guestEmail?: string) => {
    if (!bookingCode && !guestEmail) return null;
    return reservations.find(
      (res) =>
        (bookingCode && res.confirmationCode.toLowerCase() === bookingCode.toLowerCase()) ||
        (guestEmail && res.guestEmail.toLowerCase() === guestEmail.toLowerCase())
    );
  };

  const handleApprove = (review: GuestReview) => {
    const verifiedMatch = checkVerifiedReservation(review.bookingCode, review.guestEmail);
    const updated: GuestReview = {
      ...review,
      screeningStatus: 'approved',
      screenedAt: new Date().toLocaleString(),
      screenedBy: 'Front Desk Staff',
      screeningNote: review.screeningNote || 'Approved after staff screening and verification.',
      isVerifiedStay: review.isVerifiedStay ?? !!verifiedMatch,
      flags: review.flags ? review.flags.filter(f => f !== 'Pending Screening').concat('Approved') : ['Approved']
    };
    onUpdateReview(updated);
    onShowToast(`Review for ${review.roomName} approved and published live!`, 'success');
  };

  const handleConfirmReject = () => {
    if (!rejectModalReview) return;
    const finalNote = rejectCustomNote ? `${rejectReason} - ${rejectCustomNote}` : rejectReason;
    const updated: GuestReview = {
      ...rejectModalReview,
      screeningStatus: 'rejected',
      screenedAt: new Date().toLocaleString(),
      screenedBy: 'Front Desk Staff',
      screeningNote: finalNote,
      flags: ['Rejected', rejectReason]
    };
    onUpdateReview(updated);
    onShowToast(`Review by ${rejectModalReview.guestName} rejected and hidden from public view.`, 'info');
    setRejectModalReview(null);
    setRejectCustomNote('');
  };

  const handleFlagForManager = (review: GuestReview) => {
    const updated: GuestReview = {
      ...review,
      screeningStatus: 'flagged',
      screenedAt: new Date().toLocaleString(),
      screenedBy: 'Front Desk Staff',
      screeningNote: 'Flagged for Manager Review / Further Investigation',
      flags: (review.flags || []).concat('Flagged for Review')
    };
    onUpdateReview(updated);
    onShowToast(`Review flagged for Manager review.`, 'info');
  };

  const handleSaveStaffReply = (review: GuestReview) => {
    if (!replyText.trim()) {
      onShowToast('Please type a reply message.', 'error');
      return;
    }
    const updated: GuestReview = {
      ...review,
      staffResponse: replyText.trim(),
    };
    onUpdateReview(updated);
    onShowToast('Official Front Desk reply saved and published with review.', 'success');
    setEditingReplyId(null);
    setReplyText('');
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesStatus = filterStatus === 'all' || review.screeningStatus === filterStatus;
    const matchesRoom = selectedRoomId === 'all' || review.roomId === selectedRoomId;
    const matchesSearch =
      review.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.bookingCode && review.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesRoom && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Screening Stats */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-lg border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              Front Desk Trust & Safety Screening
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Guest Review Screening & Moderation
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Screen every submitted guest review before it appears publicly. Verify authentic booking codes, filter promotional spam, approve genuine guest feedback, and publish official Front Desk responses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xs text-slate-300 font-medium">Pending Screening</div>
              <div className="text-2xl font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1.5">
                <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                {pendingReviews.length}
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xs text-slate-300 font-medium">Live Approved</div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                {approvedReviews.length}
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xs text-slate-300 font-medium">Avg Rating</div>
              <div className="text-2xl font-black text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                {avgRating}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Screening</span>
            {pendingReviews.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-amber-600 text-[10px] font-black">
                {pendingReviews.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('approved')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approved & Live ({approvedReviews.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('rejected')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected / Blocked ({rejectedReviews.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>All ({totalReviews})</span>
          </button>
        </div>

        {/* Room Selector & Search */}
        <div className="flex items-center gap-2">
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Rooms</option>
            {rooms.map((rm) => (
              <option key={rm.id} value={rm.id}>
                Room {rm.roomNumber} - {rm.name}
              </option>
            ))}
          </select>

          <div className="relative w-full md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest or text..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Review Queue List */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No reviews match the filter
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {filterStatus === 'pending'
              ? 'Great work! The pending review screening queue is all clear.'
              : 'Try selecting a different status or clear the search query.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => {
            const verifiedMatch = checkVerifiedReservation(review.bookingCode, review.guestEmail);
            const isPending = review.screeningStatus === 'pending';
            const isApproved = review.screeningStatus === 'approved';
            const isRejected = review.screeningStatus === 'rejected';

            return (
              <div
                key={review.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-amber-50/40 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/40 shadow-xs'
                    : isApproved
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                    : 'bg-rose-50/30 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/30 opacity-80'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  {/* Left: Review Info & Guest Meta */}
                  <div className="space-y-3 flex-1">
                    {/* Header line */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60">
                        Room {review.roomNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {review.roomName}
                      </span>

                      {/* Status badge */}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending Front Desk Screening
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Live & Published
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[11px] font-bold flex items-center gap-1">
                          <Ban className="w-3 h-3" />
                          Rejected / Hidden
                        </span>
                      )}

                      {/* Verified Stay badge */}
                      {(review.isVerifiedStay || verifiedMatch) && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          Verified Stay {review.bookingCode ? `(${review.bookingCode})` : ''}
                        </span>
                      )}
                    </div>

                    {/* Guest details & Rating */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {review.guestName}
                      </div>
                      <span>•</span>
                      <span>{review.guestEmail}</span>
                      {review.guestPhone && (
                        <>
                          <span>•</span>
                          <span>{review.guestPhone}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-[11px]">Submitted: {review.createdAt}</span>
                    </div>

                    {/* Star Rating & Content */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        {review.title && (
                          <span className="text-xs font-bold text-slate-900 dark:text-white ml-1">
                            "{review.title}"
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                        {review.comment}
                      </p>
                    </div>

                    {/* Screening Notes & Verification signals */}
                    {review.screeningNote && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Front Desk Screening Note: </span>
                          <span>{review.screeningNote}</span>
                          {review.screenedAt && (
                            <span className="text-[10px] text-slate-400 ml-2">({review.screenedAt} by {review.screenedBy})</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Staff Public Response */}
                    {review.staffResponse ? (
                      <div className="text-xs bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 p-3 rounded-xl">
                        <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Official Front Desk Response:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReplyId(review.id);
                              setReplyText(review.staffResponse || '');
                            }}
                            className="text-[11px] text-indigo-600 hover:underline font-normal cursor-pointer"
                          >
                            Edit Reply
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                          {review.staffResponse}
                        </p>
                      </div>
                    ) : null}

                    {/* Inline Staff Response Editor */}
                    {editingReplyId === review.id && (
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-indigo-300 dark:border-indigo-700 space-y-2">
                        <label className="text-xs font-bold text-slate-800 dark:text-white">
                          Compose Official Front Desk Reply:
                        </label>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          placeholder="Write a polite response from the management team..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-hidden"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReplyId(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveStaffReply(review)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            Post Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Quick Action Controls */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                    {/* Primary Action Button */}
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(review)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRejectModalReview(review)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold text-xs transition-all cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : isApproved ? (
                      <div className="flex items-center gap-2">
                        {!review.staffResponse && editingReplyId !== review.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReplyId(review.id);
                              setReplyText('');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply to Guest</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setRejectModalReview(review)}
                          className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium cursor-pointer"
                          title="Unpublish / Reject review"
                        >
                          Unpublish
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApprove(review)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-evaluate & Approve</span>
                      </button>
                    )}

                    {/* Secondary menu items */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleFlagForManager(review)}
                        className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        Flag for Manager
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Permanently delete review from ${review.guestName}?`)) {
                            onDeleteReview(review.id);
                            onShowToast('Review deleted permanently.', 'info');
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete Review Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50">
                <Ban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reject & Screen Out Review
                </h3>
                <p className="text-xs text-slate-500">
                  By {rejectModalReview.guestName} for Room {rejectModalReview.roomNumber}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Screening Reason:
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Unverified Non-Guest / Spam">Unverified Non-Guest / Spam</option>
                  <option value="Contains Inappropriate Content or Profanity">Contains Inappropriate Content or Profanity</option>
                  <option value="Promotional Link / Commercial Advertisement">Promotional Link / Commercial Advertisement</option>
                  <option value="Contains Private / Contact Information">Contains Private / Contact Information</option>
                  <option value="Off-Topic or Misdirected Feedback">Off-Topic or Misdirected Feedback</option>
                  <option value="Duplicate Submission">Duplicate Submission</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Additional Internal Screening Note (Optional):
                </label>
                <textarea
                  value={rejectCustomNote}
                  onChange={(e) => setRejectCustomNote(e.target.value)}
                  rows={2}
                  placeholder="e.g., Booking code did not match any historical records."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalReview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

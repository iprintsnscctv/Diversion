import React, { useState } from 'react';
import { Room, GuestReview } from '../../types';
import { 
  X, Users, Check, Shield, Clock, Calendar, ChevronLeft, ChevronRight, 
  Sparkles, AlertCircle, Star, MessageSquare, ShieldCheck, Send, CheckCircle2 
} from 'lucide-react';
import { formatPHP } from '../../utils/formatCurrency';

interface RoomDetailModalProps {
  room: Room;
  reviews?: GuestReview[];
  onSubmitReview?: (reviewData: {
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    bookingCode?: string;
    rating: number;
    title: string;
    comment: string;
  }) => void;
  onClose: () => void;
  onBook: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ 
  room, 
  reviews = [], 
  onSubmitReview,
  onClose, 
  onBook 
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittedBanner, setSubmittedBanner] = useState(false);

  // Review form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  // Only approved reviews appear to guests
  const roomApprovedReviews = reviews.filter(
    (r) => r.roomId === room.id && r.screeningStatus === 'approved'
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !comment) return;

    if (onSubmitReview) {
      onSubmitReview({
        guestName,
        guestEmail,
        bookingCode: bookingCode.trim() || undefined,
        rating,
        title: reviewTitle.trim() || 'Guest Experience',
        comment: comment.trim(),
      });
    }

    setSubmittedBanner(true);
    setShowReviewForm(false);
    setGuestName('');
    setGuestEmail('');
    setBookingCode('');
    setReviewTitle('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Room {room.roomNumber} • {room.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{room.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Image Gallery Slider */}
            <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
              <img
                src={room.images[activeImageIndex]}
                alt={room.name}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                {room.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Overview Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Capacity</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Up to {room.capacity} Guests</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Floor & Size</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                  Floor {room.floor} • {room.sizeSqM} m²
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Nightly Rate</div>
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {formatPHP(room.pricePerNight)} PHP
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Transient Hourly</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {room.pricePerHour ? `${formatPHP(room.pricePerHour)}/hr` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">About This Room</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Room Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {room.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Rates Matrix Card (Days, Pax, Holidays) */}
            {room.customRates && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Special Dynamic Rates & Pax Policies</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    PHP (₱)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Pax policy */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Guest Capacity</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      Base: {room.customRates.paxRule?.basePax || Math.min(2, room.capacity)} Pax
                    </div>
                    {room.customRates.paxRule && room.customRates.paxRule.extraPaxRate > 0 && (
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                        +{formatPHP(room.customRates.paxRule.extraPaxRate)} / extra pax
                      </div>
                    )}
                  </div>

                  {/* Weekend / Days of week */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Days of the Week</div>
                    {room.customRates.dayOfWeekRates && room.customRates.dayOfWeekRates.filter((d) => d.enabled).length > 0 ? (
                      <div className="text-[11px] text-slate-900 dark:text-white font-medium mt-0.5">
                        {room.customRates.dayOfWeekRates
                          .filter((d) => d.enabled)
                          .map((d) => `${d.name.slice(0, 3)}: ${formatPHP(d.fixedPrice || room.pricePerNight)}`)
                          .join(', ')}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 mt-0.5">Uniform daily base rate</div>
                    )}
                  </div>

                  {/* Holidays or Stay Discounts */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Special Dates / Perks</div>
                    {room.customRates.specificDateRates && room.customRates.specificDateRates.length > 0 ? (
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                        {room.customRates.specificDateRates.length} Holiday Date(s) Configured
                      </div>
                    ) : room.customRates.durationDiscounts && room.customRates.durationDiscounts.length > 0 ? (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        {room.customRates.durationDiscounts[0].label}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 mt-0.5">Standard booking terms</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GUEST REVIEWS & FRONT DESK SCREENING SECTION */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    Verified Guest Reviews ({roomApprovedReviews.length})
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All reviews are screened and verified by our Front Desk team.
                  </p>
                </div>

                {!showReviewForm && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(true);
                      setSubmittedBanner(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                  >
                    + Write a Review
                  </button>
                )}
              </div>

              {/* Screening notice banner when submitted */}
              {submittedBanner && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 animate-in fade-in">
                  <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-amber-900 dark:text-amber-200">
                      Review Submitted for Front Desk Screening!
                    </div>
                    <div className="text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                      Thank you for your feedback! Our Front Desk operations team is reviewing and screening your submission. It will be published once verified.
                    </div>
                  </div>
                </div>
              )}

              {/* Write Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Share Your Stay Experience
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-[11px] text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-indigo-500" />
                    <span>
                      <strong>Front Desk Moderation:</strong> All submissions undergo guest stay screening before appearing on the public page.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g., Alexander Wright"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="e.g., alex@example.com"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Booking Confirmation Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={bookingCode}
                        onChange={(e) => setBookingCode(e.target.value)}
                        placeholder="e.g., DIV-8921-XQ (for Verified Stay badge)"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Star Rating (1 to 5)
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-2">
                          {rating} / 5 Stars
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g., Very comfortable family stay near Calle Crisologo"
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Your Detailed Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share feedback on cleanliness, location, front desk service, room comfort..."
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Screening</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Approved Reviews List */}
              {roomApprovedReviews.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  No screened reviews posted for this room yet. Be the first to share your experience!
                </div>
              ) : (
                <div className="space-y-3">
                  {roomApprovedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {rev.guestName}
                          </span>
                          {rev.isVerifiedStay && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              Verified Stay
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1.5">{rev.createdAt}</span>
                        </div>
                      </div>

                      {rev.title && (
                        <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                          "{rev.title}"
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>

                      {/* Staff Response */}
                      {rev.staffResponse && (
                        <div className="mt-2.5 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 text-xs">
                          <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 mb-0.5">
                            <MessageSquare className="w-3 h-3" />
                            Front Desk Response:
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                            {rev.staffResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* House Rules & Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  House Rules
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {room.houseRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Cancellation & Policies
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {room.cancellationPolicy}
                </p>
                <div className="mt-3 text-[11px] text-slate-500">
                  Standard Check-in: 2:00 PM | Check-out: 12:00 PM (Noon)
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Total Price per night</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatPHP(room.pricePerNight)} <span className="text-xs font-normal text-slate-500">PHP</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBook(room);
                }}
                disabled={room.status === 'Maintenance'}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all ${
                  room.status === 'Maintenance'
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                }`}
              >
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

'use client';

/**
 * ReservationForm — Client Component
 *
 * Interactive form to book a table at Lumina Café.
 * Validates input with Zod, submits via the bookTable server action,
 * and displays success/error states with smooth transitions.
 *
 * @module components/reservation/reservation-form
 */

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarDays, Clock, Users, Check, AlertCircle } from 'lucide-react';
import { bookTable } from '@/app/actions/reservation.actions';

gsap.registerPlugin(ScrollTrigger);

// ─── Time Slots ───

const TIME_SLOTS = [
    '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00',
];

// ─── Form State ───

interface FormState {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    partySize: number;
    date: string;
    timeSlot: string;
    specialRequests: string;
}

const initialFormState: FormState = {
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    partySize: 2,
    date: '',
    timeSlot: '',
    specialRequests: '',
};

export default function ReservationForm() {
    const [form, setForm] = useState<FormState>(initialFormState);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    // ─── Scroll-in animation ───
    useGSAP(
        () => {
            gsap.fromTo(
                headerRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                }
            );
        },
        { scope: sectionRef }
    );

    // ─── Generate min date (today) ───
    const today = new Date().toISOString().split('T')[0];

    // ─── Handlers ───

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'partySize' ? parseInt(value, 10) || 1 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const result = await bookTable({
                guestName: form.guestName,
                guestEmail: form.guestEmail,
                guestPhone: form.guestPhone || null,
                partySize: form.partySize,
                date: form.date,
                timeSlot: form.timeSlot,
                specialRequests: form.specialRequests || null,
            });

            if (result.success) {
                setStatus('success');
                // Animate success state in
                if (successRef.current) {
                    gsap.fromTo(
                        successRef.current,
                        { y: 20, opacity: 0, scale: 0.95 },
                        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
                    );
                }
            } else {
                setStatus('error');
                setErrorMessage(result.error);
            }
        } catch {
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    const resetForm = () => {
        setForm(initialFormState);
        setStatus('idle');
        setErrorMessage('');
    };

    // ─── Render ───

    return (
        <section
            ref={sectionRef}
            id="reserve"
            className="py-32 px-8 md:px-16 bg-cream text-charcoal relative overflow-hidden"
        >
            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-16">
                    <h2 className="text-moss text-4xl md:text-5xl font-bold mb-4">
                        Reserve a Table
                    </h2>
                    <p className="font-mono text-charcoal/60 max-w-lg mx-auto">
                        Book a seat at the tasting room or secure your morning corner. Walk-ins welcome, but reservations are encouraged.
                    </p>
                </div>

                {status === 'success' ? (
                    /* ── Success State ── */
                    <div ref={successRef} className="text-center py-16 opacity-0">
                        <div className="w-20 h-20 mx-auto bg-moss/10 rounded-full flex items-center justify-center mb-6">
                            <Check className="w-10 h-10 text-moss" />
                        </div>
                        <h3 className="text-3xl font-bold font-sans text-charcoal mb-3">
                            Reservation Confirmed
                        </h3>
                        <p className="font-mono text-charcoal/60 mb-2">
                            {form.guestName}, your table for {form.partySize} is secured.
                        </p>
                        <p className="font-mono text-charcoal/40 text-sm">
                            {form.date} at {form.timeSlot} — a confirmation email has been sent to {form.guestEmail}.
                        </p>
                        <button
                            onClick={resetForm}
                            className="mt-8 bg-charcoal text-cream px-8 py-3 rounded-full font-medium hover:bg-black transition-colors"
                        >
                            Make Another Reservation
                        </button>
                    </div>
                ) : (
                    /* ── Form ── */
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-charcoal/5"
                    >
                        {/* Error Banner */}
                        {status === 'error' && (
                            <div className="mb-8 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 font-mono">{errorMessage}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="guestName" className="text-xs font-mono uppercase tracking-widest text-charcoal/50">
                                    Full Name *
                                </label>
                                <input
                                    id="guestName"
                                    name="guestName"
                                    type="text"
                                    required
                                    value={form.guestName}
                                    onChange={handleChange}
                                    placeholder="e.g. Aria Velasquez"
                                    className="px-4 py-3 rounded-xl bg-cream border border-charcoal/10 font-sans text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="guestEmail" className="text-xs font-mono uppercase tracking-widest text-charcoal/50">
                                    Email *
                                </label>
                                <input
                                    id="guestEmail"
                                    name="guestEmail"
                                    type="email"
                                    required
                                    value={form.guestEmail}
                                    onChange={handleChange}
                                    placeholder="aria@example.com"
                                    className="px-4 py-3 rounded-xl bg-cream border border-charcoal/10 font-sans text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="guestPhone" className="text-xs font-mono uppercase tracking-widest text-charcoal/50">
                                    Phone (optional)
                                </label>
                                <input
                                    id="guestPhone"
                                    name="guestPhone"
                                    type="tel"
                                    value={form.guestPhone}
                                    onChange={handleChange}
                                    placeholder="+1-555-0142"
                                    className="px-4 py-3 rounded-xl bg-cream border border-charcoal/10 font-sans text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition-all"
                                />
                            </div>

                            {/* Party Size */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="partySize" className="text-xs font-mono uppercase tracking-widest text-charcoal/50">
                                    <Users className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                                    Party Size *
                                </label>
                                <select
                                    id="partySize"
                                    name="partySize"
                                    required
                                    value={form.partySize}
                                    onChange={handleChange}
                                    className="px-4 py-3 rounded-xl bg-cream border border-charcoal/10 font-sans text-charcoal focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition-all appearance-none"
                                >
                                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>
                                            {n} {n === 1 ? 'Guest' : 'Guests'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="date" className="text-xs font-mono uppercase tracking-widest text-charcoal/50">
                                    <CalendarDays className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                                    Date *
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    required
                                    min={today}
                                    value={form.date}
                                    onChange={handleChange}
                                    className="px-4 py-3 rounded-xl bg-cream border border-charcoal/10 font-sans text-charcoal focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition-all"
                                />
                            </div>

                            {/* Time Slot */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="timeSlot" className="text-xs font-mono uppercase tracking-widest text-charcoal/50">
                                    <Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                                    Time Slot *
                                </label>
                                <select
                                    id="timeSlot"
                                    name="timeSlot"
                                    required
                                    value={form.timeSlot}
                                    onChange={handleChange}
                                    className="px-4 py-3 rounded-xl bg-cream border border-charcoal/10 font-sans text-charcoal focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition-all appearance-none"
                                >
                                    <option value="">Select a time</option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Special Requests */}
                        <div className="mt-6 flex flex-col gap-2">
                            <label htmlFor="specialRequests" className="text-xs font-mono uppercase tracking-widest text-charcoal/50">
                                Special Requests (optional)
                            </label>
                            <textarea
                                id="specialRequests"
                                name="specialRequests"
                                value={form.specialRequests}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Window seat preferred, dietary needs, celebrations..."
                                className="px-4 py-3 rounded-xl bg-cream border border-charcoal/10 font-sans text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition-all resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="mt-8 w-full bg-moss text-cream py-4 rounded-2xl font-bold text-lg uppercase tracking-wider transition-all hover:bg-moss/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                'Secure Your Table'
                            )}
                        </button>

                        <p className="mt-4 text-center text-xs font-mono text-charcoal/30">
                            Walk-ins are always welcome. Reservations guarantee your time slot.
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
}

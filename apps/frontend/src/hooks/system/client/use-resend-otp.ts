import * as React from "react";

export function useResendOtp(fn: () => Promise<boolean>, delay: number = 60) {
    const [secondsLeft, setSecondsLeft] = React.useState(0);
    const [isSending, setIsSending] = React.useState(false);

    const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(
        null,
    );

    const clearTimer = React.useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startCountdown = React.useCallback(() => {
        clearTimer();
        setSecondsLeft(delay);

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [delay, clearTimer]);

    const resendOtp = React.useCallback(async () => {
        if (isSending || secondsLeft > 0) return false;

        setIsSending(true);

        try {
            const success = await fn();

            if (success) {
                startCountdown();
            }

            return success;
        } catch (error) {
            return false;
        } finally {
            setIsSending(false);
        }
    }, [isSending, secondsLeft, fn, startCountdown]);

    React.useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    const canResend = secondsLeft === 0 && !isSending;

    return {
        resendOtp,
        secondsLeft,
        isSending,
        canResend,
    };
}

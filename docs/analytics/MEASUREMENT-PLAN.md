# GA4 measurement plan

The repository uses the existing Google tag directly. All custom events are
suppressed until analytics consent activates it. Rejected or pre-consent actions
are never queued for later delivery. GA4's normal page view remains separate.

| Event | Purpose | Trigger | Parameters |
| --- | --- | --- | --- |
| `project_view` | Understand which portfolio projects people open. | A project detail page loads with consent, or consent is granted while that page is open; at most once per page load. | `project_key` (stable translation key), `project_slug`, `project_title`, `project_category`, `locale` |
| `cv_download` | Measure stronger visitor or recruiter interest. | A CV download link on About or Contact is clicked after consent. | `locale`, `file_name`, `link_url`, `link_location` (`about` or `contact`) |
| `contact_submit` | Measure direct contact intent. | A valid native contact-form submission after consent. | `locale`, `form_id` (`contact`) |

`contact_submit` means **a valid submission attempt**, not confirmed delivery or
a confirmed lead. The form posts directly to Formspree; the website does not
receive a reliable success response before the browser navigates. Invalid forms
and submit-button clicks without a valid submission do not trigger this event.
No name, email address, message or other form-field value is sent in custom
events. Analytics consent does not affect the form, project links or CV download.

## Attribution and GA4 setup

Use GA4's normal acquisition dimensions, not custom attribution storage or
duplicated UTM event parameters. External portfolio links should use these
exact campaign values:

| Parameter | Values |
| --- | --- |
| `utm_source` | `linkedin`, `cv`, `old_portfolio` |
| `utm_medium` | `profile`, `pdf`, `referral` |
| `utm_campaign` | `portfolio` |

Recommended GA4 key events: `contact_submit` — yes; `cv_download` — probably;
`project_view` — no, because it is an engagement signal rather than a
conversion. Marking key events is a separate GA4 Admin decision, not a
repository setting.

## Verification

1. Open a local or deployed page with `?debug_ga=1`; the flag adds
   `debug_mode: true` to custom events only, and only after analytics consent.
   It is not stored or enabled for normal visitors.
2. Without consent, open a project, click a CV link, and attempt a valid form
   submission. Confirm there is no Google tag request or custom event. Repeat
   with a saved rejection. Avoid submitting a real test message to Formspree
   unless intentionally testing delivery.
3. Accept analytics. Open any project detail page and check `project_view` once.
   On About or Contact, click a CV link and check `cv_download`. Submit a valid
   contact form and check `contact_submit`; its parameters must contain no form
   values. If already on a project page when accepting, `project_view` may fire
   then; earlier clicks and submissions are never replayed.
4. In GA4, use Realtime to see incoming events or DebugView for a session using
   `?debug_ga=1`. Check `linkedin / profile`, `cv / pdf` or
   `old_portfolio / referral` attribution using GA4's acquisition dimensions.
5. Withdraw consent through Cookie settings. The page reloads without the tag;
   repeat interactions and confirm no custom events are sent.

Browser extensions, network blocking or GA4 processing delays may prevent an
event from appearing in Realtime or DebugView even when the local dispatch path
is correct. The native form navigation also does not guarantee that an
asynchronous analytics request is delivered; it is deliberately not delayed.

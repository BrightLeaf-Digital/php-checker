/* global brightleafDigitalPhpCheckerAjax */
(function ($) {
	$(function () {
		const $form = $('#brightleaf-digital-php-checker-form');
		if ($form.length === 0) {
			return;
		}

		const $results = $('#brightleaf-digital-php-checker-results');
		const ajaxCfg =
			typeof brightleafDigitalPhpCheckerAjax !== 'undefined'
				? brightleafDigitalPhpCheckerAjax
				: {};
		const ajaxUrl =
			ajaxCfg.ajaxUrl || (typeof ajaxurl !== 'undefined' ? ajaxurl : '');
		const pollInterval = ajaxCfg.pollInterval
			? parseInt(ajaxCfg.pollInterval, 10)
			: 3000;
		// Warn after this many consecutive failed status requests; give up after the second.
		const failWarnAfter = 2;
		const failGiveUpAfter = 10;
		let pollTimer = null;
		let currentJobId = null;
		// Polls run one at a time: each status request may scan an item, so overlapping requests would race.
		let pollInFlight = false;
		let pollSoon = false;
		let pollFailures = 0;

		function escapeHtml(str) {
			return $('<div/>').text(String(str)).html();
		}

		function setControlsDisabled(disabled) {
			$('#blpc-pause, #blpc-stop').prop('disabled', !!disabled);
		}

		function renderControls() {
			if ($('#blpc-controls').length) {
				return;
			}
			const $wrap = $(
				'<div id="blpc-controls" style="margin:10px 0;"></div>'
			);
			const $pause = $(
				'<button type="button" class="button">Pause</button>'
			).attr('id', 'blpc-pause');
			const $stop = $(
				'<button type="button" class="button">Stop</button>'
			)
				.attr('id', 'blpc-stop')
				.css('margin-left', '6px');
			$wrap.append($pause, $stop);
			$results.before($wrap);
			$pause.on('click', function () {
				if (!currentJobId) {
					return;
				}
				// Immediate UI feedback: Pausing…
				renderProgress(
					'pausing',
					$('#blpc-progress').data('pct') || 0,
					'Pausing…'
				);
				setControlsDisabled(true);
				const data = $form.serializeArray();
				data.push({
					name: 'action',
					value: 'brightleaf_digital_php_checker_scan_toggle_pause',
				});
				data.push({ name: 'job_id', value: currentJobId });
				$.post(ajaxUrl, $.param(data)).done(function (resp) {
					// After server toggles, next poll will reflect paused/running.
					setControlsDisabled(false);
					if (resp && resp.success && resp.data && resp.data.status) {
						const st = resp.data.status;
						$('#blpc-pause').text(
							st === 'paused' ? 'Resume' : 'Pause'
						);
						if (st === 'paused') {
							renderProgress(
								'paused',
								$('#blpc-progress').data('pct') || 0,
								'Paused.'
							);
						} else {
							renderProgress(
								'running',
								$('#blpc-progress').data('pct') || 0,
								'Resumed.'
							);
						}
					}
					// Trigger an immediate status tick to update UI promptly.
					if (currentJobId) {
						pollStatus(currentJobId);
					}
				});
			});
			$stop.on('click', function () {
				if (!currentJobId) {
					return;
				}
				// Immediate UI feedback: Cancelling… and disable buttons.
				renderProgress(
					'cancelling',
					$('#blpc-progress').data('pct') || 0,
					'Cancelling…'
				);
				$('#blpc-stop').text('Stopping…');
				setControlsDisabled(true);
				const data = $form.serializeArray();
				data.push({
					name: 'action',
					value: 'brightleaf_digital_php_checker_scan_cancel',
				});
				data.push({ name: 'job_id', value: currentJobId });
				$.post(ajaxUrl, $.param(data)).always(function () {
					// Kick an immediate poll so we transition to cancelled ASAP.
					if (currentJobId) {
						pollStatus(currentJobId);
					}
				});
			});
		}

		function renderProgress(status, progress, message) {
			const pct = parseInt(progress, 10) || 0;
			const safeMsg = message ? escapeHtml(message) : '';
			$results.html(
				'<div id="blpc-progress" class="notice notice-info" data-pct="' +
					pct +
					'"><p>Scan status: ' +
					escapeHtml(status) +
					' (' +
					pct +
					'%). ' +
					safeMsg +
					'</p></div>'
			);
		}

		function renderPollWarning(message) {
			let $warn = $('#blpc-poll-warning');
			if ($warn.length === 0) {
				$warn = $(
					'<div id="blpc-poll-warning" class="notice notice-warning"><p></p></div>'
				);
				$results.append($warn);
			}
			$warn.find('p').text(message);
		}

		function stopPolling() {
			clearTimeout(pollTimer);
			pollTimer = null;
			pollSoon = false;
		}

		function pollStatus(jobId) {
			if (pollInFlight) {
				// Pause/Stop asked for a prompt update; run it as soon as the current request returns.
				pollSoon = true;
				return;
			}
			clearTimeout(pollTimer);
			pollTimer = null;
			pollInFlight = true;
			let keepPolling = true;
			const data = $form.serializeArray();
			data.push({
				name: 'action',
				value: 'brightleaf_digital_php_checker_scan_status',
			});
			data.push({ name: 'job_id', value: jobId });
			data.push({ name: 'tick', value: 1 });
			$.post(ajaxUrl, $.param(data))
				.done(function (resp) {
					if (jobId !== currentJobId) {
						return;
					}
					pollFailures = 0;
					if (!resp || !resp.success || !resp.data) {
						const msg =
							resp && resp.data && resp.data.message
								? resp.data.message
								: 'Unexpected polling response.';
						$results.html(
							'<div class="notice notice-error"><p>' +
								escapeHtml(msg) +
								'</p></div>'
						);
						keepPolling = false;
						currentJobId = null;
						$('#blpc-controls').remove();
						return;
					}
					const d = resp.data;
					if (d.status === 'done' || d.status === 'cancelled') {
						keepPolling = false;
						currentJobId = null;
						$('#blpc-controls').remove();
						$results.html(
							d.html ||
								'<div class="notice notice-info"><p>Scan ' +
									(d.status === 'done'
										? 'completed'
										: 'cancelled') +
									'.</p></div>'
						);
						return;
					}
					if (d.status === 'error') {
						keepPolling = false;
						currentJobId = null;
						$('#blpc-controls').remove();
						const safe = escapeHtml(d.message || 'Scan failed.');
						$results.html(
							'<div class="notice notice-error"><p>' +
								safe +
								'</p></div>'
						);
						return;
					}
					if (d.status === 'paused') {
						$('#blpc-pause').text('Resume');
						setControlsDisabled(false);
					} else if (d.status === 'cancelling') {
						$('#blpc-pause').text('Pause');
						$('#blpc-stop').text('Stopping…');
						setControlsDisabled(true);
					} else {
						$('#blpc-pause').text('Pause');
						setControlsDisabled(false);
					}
					renderProgress(
						d.status || 'running',
						parseInt(d.progress || 0, 10),
						d.message || ''
					);
				})
				.fail(function (xhr) {
					if (jobId !== currentJobId) {
						return;
					}
					pollFailures++;
					const httpStatus =
						xhr && xhr.status ? ' (HTTP ' + xhr.status + ')' : '';
					if (pollFailures >= failGiveUpAfter) {
						keepPolling = false;
						currentJobId = null;
						$('#blpc-controls').remove();
						$results.html(
							'<div class="notice notice-error"><p>' +
								escapeHtml(
									'The scan stopped responding' +
										httpStatus +
										' after ' +
										pollFailures +
										' failed status requests. Reload the page and try again, or scan fewer items at once.'
								) +
								'</p></div>'
						);
						return;
					}
					if (pollFailures >= failWarnAfter) {
						renderPollWarning(
							'Status requests are failing' +
								httpStatus +
								'. An item may be timing out; retrying (' +
								pollFailures +
								' of ' +
								failGiveUpAfter +
								')…'
						);
					}
				})
				.always(function () {
					pollInFlight = false;
					if (
						!currentJobId ||
						(!keepPolling && currentJobId === jobId)
					) {
						pollSoon = false;
						return;
					}
					// A newer job (or a Pause/Stop click) polls right away; otherwise wait the interval.
					const delay =
						pollSoon || currentJobId !== jobId ? 0 : pollInterval;
					pollSoon = false;
					pollTimer = setTimeout(function () {
						pollStatus(currentJobId);
					}, delay);
				});
		}

		$form.on('submit', function (e) {
			e.preventDefault();
			const data = $form.serializeArray();
			data.push({
				name: 'action',
				value: 'brightleaf_digital_php_checker_scan_start',
			});
			$results.html('<p>Starting scan…</p>');
			$.post(ajaxUrl, $.param(data))
				.done(function (resp) {
					if (resp && resp.success && resp.data && resp.data.job_id) {
						currentJobId = resp.data.job_id;
						renderControls();
						renderProgress(
							'queued',
							0,
							'Job ' + currentJobId + ' created.'
						);
						stopPolling();
						pollFailures = 0;
						pollStatus(currentJobId);
						return;
					}
					const raw =
						resp && resp.data && resp.data.message
							? resp.data.message
							: 'Unexpected error';
					const safe = escapeHtml(raw);
					$results.html(
						'<div class="notice notice-error"><p>' +
							safe +
							'</p></div>'
					);
				})
				.fail(function () {
					$results.html(
						'<div class="notice notice-error"><p>AJAX request failed.</p></div>'
					);
				});
		});
	});
})(jQuery);

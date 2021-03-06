from __future__ import print_function, unicode_literals

import time

from django.core.management.base import BaseCommand, CommandError

from watchdog.observers import Observer
from watchdog.tricks import ShellCommandTrick


class SassCompilerTrick(ShellCommandTrick):
    def __init__(self, sass_dir='sass'):
        self.sass_dir = sass_dir
        command = 'make css'

        super(SassCompilerTrick, self).__init__(
            command,
            patterns=['*.scss'],
            ignore_directories=True,
            wait_for_process=True
        )

    def on_any_event(self, event):
        print("Sass recompiling... ", end="")
        super(SassCompilerTrick, self).on_any_event(event)
        print("done")


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        trick = SassCompilerTrick()
        observer = Observer(timeout=0.5)
        observer.schedule(trick, trick.sass_dir, recursive=True)
        observer.start()
        try:
            while True:
                time.sleep(0.5)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()
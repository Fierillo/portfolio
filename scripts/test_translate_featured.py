import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('tf', Path(__file__).with_name('translate-featured.py'))
tf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tf)


class ProtectRestoreTest(unittest.TestCase):
    def roundtrip(self, text, target, fake_translation=None):
        protected, slots = tf.protect(text)
        return protected, tf.restore(fake_translation or protected, slots, target)

    def test_terms_replaced_by_placeholders(self):
        protected, slots = tf.protect('Lightning wallets to zap')
        self.assertEqual(protected, 'Lightning X0X to X1X')
        self.assertEqual(slots, ['wallets', 'zap'])

    def test_longest_term_wins(self):
        _, slots = tf.protect('totem screen, wallets and a wallet')
        self.assertEqual(slots, ['totem screen', 'wallets', 'wallet'])

    def test_word_boundaries(self):
        protected, _ = tf.protect('zapping walletless')
        self.assertEqual(protected, 'zapping walletless')

    def test_restore_spanish_specials(self):
        _, out = self.roundtrip("La Crypta's totem screen: or zap the posts", 'es')
        self.assertIn('pantalla tótem', out)
        self.assertIn('zapear', out)

    def test_restore_english_keeps_terms(self):
        _, out = self.roundtrip('totem screen: zap via NWC', 'en')
        self.assertEqual(out, 'totem screen: zap via NWC')

    def test_restore_tolerates_spacing_changes(self):
        protected, slots = tf.protect('wallet bot')
        self.assertEqual(tf.restore(protected.replace('X0X', 'X 0 X'), slots, 'es'), 'wallet bot')

    def test_lowercase_after_colon(self):
        self.assertEqual(tf.fix_colon_case('Taller: Explicación de algo', 'es'), 'Taller: explicación de algo')
        self.assertEqual(tf.fix_colon_case('Taller: Nostr', 'es'), 'Taller: Nostr')


if __name__ == '__main__':
    unittest.main()

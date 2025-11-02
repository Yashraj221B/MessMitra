from __future__ import annotations

import os
import random
from datetime import date, timedelta
from typing import Any, Dict

import unittest

import requests

API_ROOT = os.getenv('MESSMITRA_API_ROOT', 'http://localhost:5000')

def api_url(path: str) -> str:
    if not path.startswith('/'):
        path = f'/{path}'
    return f'{API_ROOT}{path}'


def unique_phone() -> str:
    digits = ''.join(random.choices('0123456789', k=9))
    return f'9{digits}'


def request_json(
    method: str,
    path: str,
    token: str | None = None,
    expected_status: int = 200,
    **kwargs: Any
) -> Dict[str, Any] | None:
    headers = kwargs.pop('headers', {})
    if token:
        headers['Authorization'] = f'Bearer {token}'
    if 'json' in kwargs and kwargs['json'] is not None:
        headers.setdefault('Content-Type', 'application/json')

    response = requests.request(method, api_url(path), headers=headers, timeout=30, **kwargs)

    try:
        payload = response.json()
    except ValueError:
        payload = None

    if response.status_code != expected_status:
        raise AssertionError(
            f'Unexpected status {response.status_code} for {method} {path}: {payload}'
        )

    return payload


def assert_success(payload: Dict[str, Any] | None, context: str = '') -> Any:
    assert payload is not None, f'Expected JSON payload {context}'
    assert payload.get('success') is True, f'Expected success response {context}: {payload}'
    return payload.get('data')


def assert_failure(payload: Dict[str, Any] | None, context: str = '') -> Dict[str, Any]:
    assert payload is not None, f'Expected JSON payload {context}'
    assert payload.get('success') is False, f'Expected failure response {context}: {payload}'
    return payload


def run_full_flow() -> None:
    manager_phone = unique_phone()
    member_phone = unique_phone()
    manager_password = 'Manager#123'
    member_password = 'Member#123'

    manager_registration = request_json(
        'POST',
        '/api/auth/register',
        json={
            'name': 'Test Manager',
            'phone': manager_phone,
            'email': f'manager{manager_phone}@example.com',
            'password': manager_password,
            'role': 'manager',
            'messName': 'Integration Mess',
            'messAddress': '42 Test Lane'
        },
        expected_status=201
    )
    manager_auth = assert_success(manager_registration, 'manager register')
    manager_token = manager_auth['accessToken']
    manager_user = manager_auth['user']
    manager_id = manager_user['id']

    member_registration = request_json(
        'POST',
        '/api/auth/register',
        json={
            'name': 'Test Member',
            'phone': member_phone,
            'email': f'member{member_phone}@example.com',
            'password': member_password,
            'role': 'member'
        },
        expected_status=201
    )
    member_auth = assert_success(member_registration, 'member register')
    member_token = member_auth['accessToken']
    member_user = member_auth['user']
    member_id = member_user['id']

    manager_profile = assert_success(
        request_json('GET', '/api/users/profile', token=manager_token),
        'manager profile'
    )
    assert manager_profile['id'] == manager_id
    mess_id = manager_profile['messId']
    assert mess_id, 'Manager profile must include mess id'

    manager_login = request_json(
        'POST',
        '/api/auth/login',
        json={'phone': manager_phone, 'password': manager_password, 'role': 'manager'}
    )
    manager_login_auth = assert_success(manager_login, 'manager login')
    manager_token = manager_login_auth['accessToken']

    updated_manager = assert_success(
        request_json(
            'PUT',
            '/api/users/profile',
            token=manager_token,
            json={'language': 'en', 'theme': 'dark'}
        ),
        'manager profile update'
    )
    assert updated_manager['theme'] == 'dark'

    join_result = assert_success(
        request_json(
            'POST',
            '/api/messes/join',
            token=member_token,
            json={'messId': mess_id}
        ),
        'join mess'
    )
    assert join_result is None, 'Join mess response should carry no data'

    members_payload = assert_success(
        request_json('GET', f'/api/messes/{mess_id}/members', token=manager_token),
        'list members'
    )
    pending_member = next(user for user in members_payload if user['id'] == member_id)
    assert pending_member['joinStatus'] == 'pending'

    approval = assert_success(
        request_json(
            'PUT',
            f'/api/messes/{mess_id}/members/{member_id}/status',
            token=manager_token,
            json={'status': 'approved'}
        ),
        'approve member'
    )
    assert approval is None, 'Approval response should carry no data'

    member_login = request_json(
        'POST',
        '/api/auth/login',
        json={'phone': member_phone, 'password': member_password, 'role': 'member'}
    )
    member_auth = assert_success(member_login, 'member login')
    member_token = member_auth['accessToken']

    member_profile = assert_success(
        request_json('GET', '/api/users/profile', token=member_token),
        'member profile'
    )
    assert member_profile['messId'] == mess_id

    menu_date = (date.today() + timedelta(days=1)).isoformat()
    menu_payload = {
        'date': menu_date,
        'meals': {
            'breakfast': ['Poha', 'Tea'],
            'lunch': ['Rice', 'Dal'],
            'dinner': ['Roti', 'Paneer']
        }
    }
    created_menu = assert_success(
        request_json(
            'POST',
            f'/api/menus/{mess_id}',
            token=manager_token,
            json=menu_payload,
            expected_status=201
        ),
        'create menu'
    )
    menu_id = created_menu['id']

    fetched_menu = assert_success(
        request_json('GET', f'/api/menus/{menu_id}', token=manager_token),
        'menu by id'
    )
    assert fetched_menu['date'] == menu_date

    menu_for_date = assert_success(
        request_json(
            'GET',
            f'/api/menus/{mess_id}/date',
            token=manager_token,
            params={'date': menu_date}
        ),
        'menu by date'
    )
    assert menu_for_date['id'] == menu_id

    weekly_menu = assert_success(
        request_json(
            'GET',
            f'/api/menus/{mess_id}/weekly',
            token=manager_token,
            params={'startDate': menu_date}
        ),
        'weekly menu'
    )
    assert any(entry['id'] == menu_id for entry in weekly_menu)

    monthly_menu = assert_success(
        request_json(
            'GET',
            f'/api/menus/{mess_id}/monthly',
            token=manager_token,
            params={'year': date.today().year, 'month': date.today().month}
        ),
        'monthly menu'
    )
    assert any(entry['id'] == menu_id for entry in monthly_menu)

    updated_menu = assert_success(
        request_json(
            'PUT',
            f'/api/menus/{menu_id}',
            token=manager_token,
            json={'meals': {'dinner': ['Veg Biryani']}}
        ),
        'update menu'
    )
    assert 'Veg Biryani' in updated_menu['meals']['dinner']

    deleted_menu = assert_success(
        request_json('DELETE', f'/api/menus/{menu_id}', token=manager_token),
        'delete menu'
    )
    assert deleted_menu is None

    created_announcement = assert_success(
        request_json(
            'POST',
            f'/api/announcements/{mess_id}',
            token=manager_token,
            json={'title': 'Welcome', 'content': 'Welcome to the mess!'},
            expected_status=201
        ),
        'create announcement'
    )
    announcement_id = created_announcement['id']

    announcement = assert_success(
        request_json('GET', f'/api/announcements/{announcement_id}', token=manager_token),
        'announcement by id'
    )
    assert announcement['title'] == 'Welcome'

    announcement_list = assert_success(
        request_json('GET', f'/api/announcements/mess/{mess_id}', token=manager_token),
        'list announcements'
    )
    assert any(item['id'] == announcement_id for item in announcement_list)

    updated_announcement = assert_success(
        request_json(
            'PUT',
            f'/api/announcements/{announcement_id}',
            token=manager_token,
            json={'content': 'Updated message'}
        ),
        'update announcement'
    )
    assert updated_announcement['content'] == 'Updated message'

    deleted_announcement = assert_success(
        request_json('DELETE', f'/api/announcements/{announcement_id}', token=manager_token),
        'delete announcement'
    )
    assert deleted_announcement is None

    attendance_date = date.today().isoformat()
    manager_marked_attendance = assert_success(
        request_json(
            'POST',
            '/api/attendance',
            token=manager_token,
            json={
                'messId': mess_id,
                'memberId': member_id,
                'date': attendance_date,
                'mealType': 'breakfast',
                'scanMethod': 'manual'
            },
            expected_status=201
        ),
        'manager mark attendance'
    )
    attendance_id = manager_marked_attendance['id']

    attendance_details = assert_success(
        request_json('GET', f'/api/attendance/{attendance_id}', token=manager_token),
        'attendance by id'
    )
    assert attendance_details['memberId'] == member_id

    attendance_report = assert_success(
        request_json(
            'GET',
            f'/api/attendance/mess/{mess_id}/report',
            token=manager_token,
            params={'startDate': attendance_date, 'endDate': attendance_date}
        ),
        'attendance report'
    )
    assert any(item['id'] == attendance_id for item in attendance_report)

    attendance_stats = assert_success(
        request_json(
            'GET',
            f'/api/attendance/mess/{mess_id}/stats',
            token=manager_token,
            params={'startDate': attendance_date, 'endDate': attendance_date}
        ),
        'attendance stats'
    )
    assert attendance_stats['totalScans'] >= 1

    member_marked_attendance = assert_success(
        request_json(
            'POST',
            '/api/attendance',
            token=member_token,
            json={
                'messId': mess_id,
                'date': attendance_date,
                'mealType': 'dinner',
                'scanMethod': 'manual'
            },
            expected_status=201
        ),
        'member mark attendance'
    )
    assert member_marked_attendance['memberId'] == member_id

    forbidden_attendance = request_json(
        'POST',
        '/api/attendance',
        token=member_token,
        json={
            'messId': 'invalid-mess-id',
            'date': attendance_date,
            'mealType': 'lunch',
            'scanMethod': 'manual'
        },
        expected_status=403
    )
    assert_failure(forbidden_attendance, 'forbidden attendance')

    member_attendance = assert_success(
        request_json(
            'GET',
            f'/api/attendance/mess/{mess_id}/member/{member_id}',
            token=member_token,
            params={'month': date.today().month, 'year': date.today().year}
        ),
        'member attendance'
    )
    assert len(member_attendance) >= 1

    feedback_created = assert_success(
        request_json(
            'POST',
            '/api/feedback',
            token=member_token,
            json={'rating': 5, 'comment': 'Great food!' },
            expected_status=201
        ),
        'create feedback'
    )
    feedback_id = feedback_created['id']

    feedback_details = assert_success(
        request_json('GET', f'/api/feedback/{feedback_id}', token=manager_token),
        'feedback by id'
    )
    assert feedback_details['rating'] == 5

    feedback_list = assert_success(
        request_json('GET', f'/api/feedback/mess/{mess_id}', token=manager_token),
        'feedback list'
    )
    assert any(item['id'] == feedback_id for item in feedback_list)

    feedback_stats = assert_success(
        request_json('GET', f'/api/feedback/mess/{mess_id}/stats', token=manager_token),
        'feedback stats'
    )
    assert feedback_stats['totalFeedbacks'] >= 1

    leave_start = (date.today() + timedelta(days=2)).isoformat()
    leave_end = (date.today() + timedelta(days=3)).isoformat()
    created_leave = assert_success(
        request_json(
            'POST',
            '/api/leaves',
            token=member_token,
            json={'startDate': leave_start, 'endDate': leave_end, 'reason': 'Family event'},
            expected_status=201
        ),
        'create leave'
    )
    leave_id = created_leave['id']

    my_leaves = assert_success(
        request_json('GET', '/api/leaves/my-leaves', token=member_token),
        'my leaves'
    )
    assert any(item['id'] == leave_id for item in my_leaves)

    mess_leaves = assert_success(
        request_json('GET', f'/api/leaves/mess/{mess_id}', token=manager_token),
        'mess leaves'
    )
    assert any(item['id'] == leave_id for item in mess_leaves)

    updated_leave = assert_success(
        request_json(
            'PUT',
            f'/api/leaves/{leave_id}/status',
            token=manager_token,
            json={'status': 'approved'}
        ),
        'approve leave'
    )
    assert updated_leave['status'] == 'approved'

    member_leaves = assert_success(
        request_json('GET', f'/api/leaves/member/{member_id}', token=manager_token),
        'member leaves'
    )
    assert any(item['id'] == leave_id for item in member_leaves)

    leave_stats = assert_success(
        request_json(
            'GET',
            f'/api/leaves/mess/{mess_id}/stats',
            token=manager_token,
            params={'month': date.today().month, 'year': date.today().year}
        ),
        'leave stats'
    )
    assert leave_stats['totalLeaves'] >= 1

    cancel_start = (date.today() + timedelta(days=5)).isoformat()
    cancel_end = (date.today() + timedelta(days=6)).isoformat()
    leave_to_cancel = assert_success(
        request_json(
            'POST',
            '/api/leaves',
            token=member_token,
            json={'startDate': cancel_start, 'endDate': cancel_end, 'reason': 'Another event'},
            expected_status=201
        ),
        'create leave for cancel'
    )
    cancel_leave = assert_success(
        request_json(
            'PUT',
            f"/api/leaves/{leave_to_cancel['id']}/cancel",
            token=member_token
        ),
        'cancel leave'
    )
    assert cancel_leave['status'] == 'cancelled'

    created_payment = assert_success(
        request_json(
            'POST',
            '/api/payments',
            token=manager_token,
            json={
                'messId': mess_id,
                'memberId': member_id,
                'month': date.today().month,
                'year': date.today().year,
                'amount': 2500,
                'dueDate': (date.today() + timedelta(days=7)).isoformat()
            },
            expected_status=201
        ),
        'create payment'
    )
    payment_id = created_payment['id']

    mess_payments = assert_success(
        request_json('GET', f'/api/payments/mess/{mess_id}', token=manager_token),
        'mess payments'
    )
    assert any(item['id'] == payment_id for item in mess_payments)

    recorded_payment = assert_success(
        request_json(
            'PUT',
            f'/api/payments/{payment_id}/record',
            token=manager_token,
            json={'paidAmount': 2500, 'paymentMethod': 'cash'}
        ),
        'record payment'
    )
    assert recorded_payment['status'] == 'paid'

    member_payments = assert_success(
        request_json('GET', f'/api/payments/member/{member_id}', token=member_token),
        'member payments'
    )
    assert any(item['id'] == payment_id for item in member_payments)

    next_month = (date.today().month % 12) + 1
    next_year = date.today().year + (1 if next_month == 1 else 0)
    overdue_payment = assert_success(
        request_json(
            'POST',
            '/api/payments',
            token=manager_token,
            json={
                'messId': mess_id,
                'memberId': member_id,
                'month': next_month,
                'year': next_year,
                'amount': 3000,
                'dueDate': (date.today() - timedelta(days=2)).isoformat()
            },
            expected_status=201
        ),
        'create overdue payment'
    )
    overdue_id = overdue_payment['id']

    overdue_list = assert_success(
        request_json('GET', f'/api/payments/mess/{mess_id}/overdue', token=manager_token),
        'overdue payments'
    )
    assert any(item['id'] == overdue_id for item in overdue_list)

    payment_stats = assert_success(
        request_json(
            'GET',
            f'/api/payments/mess/{mess_id}/stats',
            token=manager_token,
            params={'month': date.today().month, 'year': date.today().year}
        ),
        'payment stats'
    )
    assert payment_stats['totalPayments'] >= 1

    forbidden_payment_lookup = request_json(
        'GET',
        f'/api/payments/member/{manager_id}',
        token=member_token,
        expected_status=403
    )
    assert_failure(forbidden_payment_lookup, 'forbidden payment lookup')

    notifications_list = assert_success(
        request_json('GET', '/api/notifications', token=member_token),
        'notifications list'
    )
    assert isinstance(notifications_list, list)

    unread_count = assert_success(
        request_json('GET', '/api/notifications/unread-count', token=member_token),
        'unread count'
    )
    assert 'count' in unread_count

    mark_all_read = assert_success(
        request_json('PUT', '/api/notifications/read-all', token=member_token),
        'mark notifications read'
    )
    assert mark_all_read is None

    updated_member = assert_success(
        request_json(
            'PUT',
            '/api/users/profile',
            token=member_token,
            json={'language': 'en', 'theme': 'light'}
        ),
        'member profile update'
    )
    assert updated_member['theme'] == 'light'

    password_change = assert_success(
        request_json(
            'PUT',
            '/api/users/password',
            token=member_token,
            json={'currentPassword': member_password, 'newPassword': 'Member#456'}
        ),
        'member password change'
    )
    assert password_change is None

    relogin_member = request_json(
        'POST',
        '/api/auth/login',
        json={'phone': member_phone, 'password': 'Member#456', 'role': 'member'}
    )
    relogin_auth = assert_success(relogin_member, 'member relogin')
    member_token = relogin_auth['accessToken']

    logout_member = assert_success(
        request_json('POST', '/api/auth/logout', token=member_token),
        'member logout'
    )
    assert logout_member is None

    logout_manager = assert_success(
        request_json('POST', '/api/auth/logout', token=manager_token),
        'manager logout'
    )
    assert logout_manager is None


class TestManagerMemberFlow(unittest.TestCase):
    def test_full_flow(self) -> None:
        try:
            health = requests.get(api_url('/health'), timeout=10)
            health.raise_for_status()
        except requests.RequestException as exc:
            self.skipTest(f'API not reachable: {exc}')

        run_full_flow()


if __name__ == '__main__':
    unittest.main()
